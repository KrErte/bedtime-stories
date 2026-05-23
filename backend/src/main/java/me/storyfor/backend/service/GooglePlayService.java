package me.storyfor.backend.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.androidpublisher.AndroidPublisher;
import com.google.api.services.androidpublisher.model.SubscriptionPurchase;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import me.storyfor.backend.entity.SubscriptionStatus;
import me.storyfor.backend.entity.User;
import me.storyfor.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collections;

@Service
public class GooglePlayService {

    private static final Logger log = LoggerFactory.getLogger(GooglePlayService.class);

    // Google Play Developer API scope
    private static final String SCOPE = "https://www.googleapis.com/auth/androidpublisher";

    private final UserRepository userRepository;
    private final String packageName;
    private final String serviceAccountJson;

    public GooglePlayService(
            UserRepository userRepository,
            @Value("${google.play.package-name:ee.dreamlit.app}") String packageName,
            @Value("${google.play.service-account-json:}") String serviceAccountJson) {
        this.userRepository = userRepository;
        this.packageName = packageName;
        this.serviceAccountJson = serviceAccountJson;
    }

    public boolean isConfigured() {
        return serviceAccountJson != null && !serviceAccountJson.isBlank();
    }

    /**
     * Verifitseerib Google Play subscription ostu ja uuendab kasutaja staatuse.
     *
     * @param user          kasutaja kes ostis
     * @param productId     subscription product ID (nt "pro_monthly")
     * @param purchaseToken Google Play poolt saadud token
     * @return true kui ost on kehtiv ja kasutaja uuendati pro-ks
     */
    @Transactional
    public boolean verifyAndActivate(User user, String productId, String purchaseToken) throws IOException {
        if (!isConfigured()) {
            log.warn("Google Play service account not configured — skipping verification");
            return false;
        }

        AndroidPublisher publisher = buildPublisher();
        SubscriptionPurchase purchase = publisher.purchases()
                .subscriptions()
                .get(packageName, productId, purchaseToken)
                .execute();

        log.info("Google Play purchase for user={} product={} paymentState={} expiryMs={}",
                user.getId(), productId, purchase.getPaymentState(), purchase.getExpiryTimeMillis());

        // paymentState: 0=pending, 1=received, 2=free trial, 3=pending deferred
        Integer paymentState = purchase.getPaymentState();
        boolean paid = paymentState != null && (paymentState == 1 || paymentState == 2);

        if (!paid) {
            log.warn("Purchase not paid for user={}, paymentState={}", user.getId(), paymentState);
            return false;
        }

        // Kinnita ost Google'ile (nõutav — muidu tühistatakse 3 päeva pärast)
        publisher.purchases().subscriptions()
                .acknowledge(packageName, productId, purchaseToken,
                        new com.google.api.services.androidpublisher.model.SubscriptionPurchasesAcknowledgeRequest())
                .execute();

        // Uuenda kasutaja staatus
        Instant expiry = purchase.getExpiryTimeMillis() != null
                ? Instant.ofEpochMilli(purchase.getExpiryTimeMillis())
                : null;

        user.setSubscriptionStatus(SubscriptionStatus.pro);
        user.setSubscriptionExpiresAt(expiry);
        userRepository.save(user);

        log.info("Activated pro for user={} via Google Play, expires={}", user.getId(), expiry);
        return true;
    }

    /**
     * Kontrollib kas subscription on veel aktiivne (renewal webhook asemel polling).
     * Kutsutakse /api/subscription/status endpointist.
     */
    public boolean isSubscriptionActive(String productId, String purchaseToken) {
        if (!isConfigured()) return false;
        try {
            AndroidPublisher publisher = buildPublisher();
            SubscriptionPurchase purchase = publisher.purchases()
                    .subscriptions()
                    .get(packageName, productId, purchaseToken)
                    .execute();
            long nowMs = System.currentTimeMillis();
            Long expiryMs = purchase.getExpiryTimeMillis();
            return expiryMs != null && expiryMs > nowMs;
        } catch (Exception e) {
            log.error("Error checking Google Play subscription: {}", e.getMessage());
            return false;
        }
    }

    private AndroidPublisher buildPublisher() throws IOException {
        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new ByteArrayInputStream(serviceAccountJson.getBytes(StandardCharsets.UTF_8)))
                .createScoped(Collections.singleton(SCOPE));

        return new AndroidPublisher.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName("Dreamlit")
                .build();
    }
}
