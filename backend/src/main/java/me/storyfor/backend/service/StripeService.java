package me.storyfor.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import me.storyfor.backend.entity.SubscriptionEvent;
import me.storyfor.backend.entity.SubscriptionStatus;
import me.storyfor.backend.entity.User;
import me.storyfor.backend.repository.SubscriptionEventRepository;
import me.storyfor.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class StripeService {

    private final UserRepository userRepository;
    private final SubscriptionEventRepository eventRepository;
    private final EmailService emailService;
    private final String secretKey;
    private final String webhookSecret;
    private final String priceIdEur;
    private final String priceIdUsd;
    private final String appUrl;

    public StripeService(UserRepository userRepository,
                         SubscriptionEventRepository eventRepository,
                         EmailService emailService,
                         @Value("${stripe.secret-key}") String secretKey,
                         @Value("${stripe.webhook-secret}") String webhookSecret,
                         @Value("${stripe.price-id-eur}") String priceIdEur,
                         @Value("${stripe.price-id-usd:}") String priceIdUsd,
                         @Value("${app.url}") String appUrl) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.emailService = emailService;
        this.secretKey = secretKey;
        this.webhookSecret = webhookSecret;
        this.priceIdEur = priceIdEur;
        this.priceIdUsd = priceIdUsd;
        this.appUrl = appUrl;
    }

    @PostConstruct
    public void init() {
        if (secretKey != null && !secretKey.isBlank()) {
            Stripe.apiKey = secretKey;
        }
    }

    public String createCheckoutSession(User user, String currency) throws StripeException {
        String resolvedCurrency = (currency != null) ? currency.toLowerCase() : "eur";
        String selectedPriceId = "usd".equals(resolvedCurrency) && priceIdUsd != null && !priceIdUsd.isBlank()
                ? priceIdUsd
                : priceIdEur;

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomerEmail(user.getEmail())
                .setClientReferenceId(user.getId().toString())
                .setSuccessUrl(appUrl + "/app/settings?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(appUrl + "/app/subscribe")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(selectedPriceId)
                        .setQuantity(1L)
                        .build())
                .setSubscriptionData(SessionCreateParams.SubscriptionData.builder()
                        .setTrialPeriodDays(7L)
                        .build())
                .build();
        Session session = Session.create(params);
        return session.getUrl();
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void handleWebhook(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            if (eventRepository.existsByStripeEventId(event.getId())) return;

            String type = event.getType();
            EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
            if (deserializer.getObject().isEmpty()) return;

            switch (type) {
                case "checkout.session.completed" -> {
                    Session session = (Session) deserializer.getObject().get();
                    String userId = session.getClientReferenceId();
                    User user = userRepository.findById(UUID.fromString(userId)).orElse(null);
                    if (user != null) {
                        user.setSubscriptionStatus(SubscriptionStatus.pro);
                        user.setStripeCustomerId(session.getCustomer());
                        userRepository.save(user);
                        emailService.sendSubscriptionConfirmationEmail(user.getEmail(), user.getName());
                    }
                }
                case "invoice.paid" -> {
                    Invoice invoice = (Invoice) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(invoice.getCustomer()).ifPresent(user -> {
                        user.setSubscriptionStatus(SubscriptionStatus.pro);
                        userRepository.save(user);
                    });
                }
                case "invoice.payment_failed" -> {
                    Invoice invoice = (Invoice) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(invoice.getCustomer()).ifPresent(user -> {
                        user.setSubscriptionStatus(SubscriptionStatus.cancelled);
                        userRepository.save(user);
                    });
                }
                case "customer.subscription.deleted" -> {
                    Subscription sub = (Subscription) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(sub.getCustomer()).ifPresent(user -> {
                        user.setSubscriptionStatus(SubscriptionStatus.free);
                        userRepository.save(user);
                    });
                }
                case "customer.subscription.updated" -> {
                    Subscription sub = (Subscription) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(sub.getCustomer()).ifPresent(user -> {
                        if ("active".equals(sub.getStatus()) || "trialing".equals(sub.getStatus())) {
                            user.setSubscriptionStatus(SubscriptionStatus.pro);
                        } else {
                            user.setSubscriptionStatus(SubscriptionStatus.cancelled);
                        }
                        userRepository.save(user);
                    });
                }
            }

            SubscriptionEvent se = new SubscriptionEvent();
            se.setStripeEventId(event.getId());
            se.setEventType(type);
            se.setData(payload);
            eventRepository.save(se);
        } catch (Exception e) {
            throw new RuntimeException("Webhook processing failed", e);
        }
    }

    public void cancelSubscription(User user) throws StripeException {
        if (user.getStripeCustomerId() == null) return;
        var params = com.stripe.param.SubscriptionListParams.builder()
                .setCustomer(user.getStripeCustomerId())
                .setStatus(com.stripe.param.SubscriptionListParams.Status.ACTIVE)
                .build();
        for (Subscription sub : Subscription.list(params).getData()) {
            sub.cancel();
        }
        user.setSubscriptionStatus(SubscriptionStatus.cancelled);
        userRepository.save(user);
    }
}
