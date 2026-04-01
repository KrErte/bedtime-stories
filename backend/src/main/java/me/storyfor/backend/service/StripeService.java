package me.storyfor.backend.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import me.storyfor.backend.entity.SubscriptionEvent;
import me.storyfor.backend.entity.User;
import me.storyfor.backend.repository.SubscriptionEventRepository;
import me.storyfor.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class StripeService {

    private final UserRepository userRepository;
    private final SubscriptionEventRepository eventRepository;
    private final String secretKey;
    private final String webhookSecret;
    private final String priceId;
    private final String appUrl;

    public StripeService(UserRepository userRepository,
                         SubscriptionEventRepository eventRepository,
                         @Value("${stripe.secret-key}") String secretKey,
                         @Value("${stripe.webhook-secret}") String webhookSecret,
                         @Value("${stripe.price-id}") String priceId,
                         @Value("${app.url}") String appUrl) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.secretKey = secretKey;
        this.webhookSecret = webhookSecret;
        this.priceId = priceId;
        this.appUrl = appUrl;
    }

    @PostConstruct
    public void init() {
        if (secretKey != null && !secretKey.isBlank()) {
            Stripe.apiKey = secretKey;
        }
    }

    public String createCheckoutSession(User user) throws StripeException {
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomerEmail(user.getEmail())
                .setClientReferenceId(user.getId().toString())
                .setSuccessUrl(appUrl + "/app/settings?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(appUrl + "/app/subscribe")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build())
                .setSubscriptionData(SessionCreateParams.SubscriptionData.builder()
                        .setTrialPeriodDays(7L)
                        .build())
                .build();
        Session session = Session.create(params);
        return session.getUrl();
    }

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
                        user.setSubscriptionStatus("pro");
                        user.setStripeCustomerId(session.getCustomer());
                        userRepository.save(user);
                    }
                }
                case "invoice.paid" -> {
                    Invoice invoice = (Invoice) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(invoice.getCustomer()).ifPresent(user -> {
                        user.setSubscriptionStatus("pro");
                        userRepository.save(user);
                    });
                }
                case "invoice.payment_failed" -> {
                    Invoice invoice = (Invoice) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(invoice.getCustomer()).ifPresent(user -> {
                        user.setSubscriptionStatus("cancelled");
                        userRepository.save(user);
                    });
                }
                case "customer.subscription.deleted" -> {
                    Subscription sub = (Subscription) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(sub.getCustomer()).ifPresent(user -> {
                        user.setSubscriptionStatus("free");
                        userRepository.save(user);
                    });
                }
                case "customer.subscription.updated" -> {
                    Subscription sub = (Subscription) deserializer.getObject().get();
                    userRepository.findByStripeCustomerId(sub.getCustomer()).ifPresent(user -> {
                        if ("active".equals(sub.getStatus()) || "trialing".equals(sub.getStatus())) {
                            user.setSubscriptionStatus("pro");
                        } else {
                            user.setSubscriptionStatus("cancelled");
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
        user.setSubscriptionStatus("cancelled");
        userRepository.save(user);
    }
}
