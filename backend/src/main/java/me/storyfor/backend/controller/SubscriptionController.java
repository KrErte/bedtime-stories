package me.storyfor.backend.controller;

import me.storyfor.backend.entity.User;
import me.storyfor.backend.security.SecurityUtils;
import me.storyfor.backend.service.GooglePlayService;
import me.storyfor.backend.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final StripeService stripeService;
    private final GooglePlayService googlePlayService;

    public SubscriptionController(StripeService stripeService, GooglePlayService googlePlayService) {
        this.stripeService = stripeService;
        this.googlePlayService = googlePlayService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> checkout(
            @RequestParam(defaultValue = "eur") String currency) throws Exception {
        User user = SecurityUtils.getCurrentUser();
        String url = stripeService.createCheckoutSession(user, currency);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status() {
        User user = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(Map.of("status", user.getSubscriptionStatus().name()));
    }

    @PostMapping("/cancel")
    public ResponseEntity<Map<String, String>> cancel() throws Exception {
        User user = SecurityUtils.getCurrentUser();
        stripeService.cancelSubscription(user);
        return ResponseEntity.ok(Map.of("message", "Subscription cancelled"));
    }

    /**
     * Google Play ostu verifitseerimine.
     * Flutter saadab purchaseToken + productId pärast edukat ostu.
     */
    @PostMapping("/google-play/verify")
    public ResponseEntity<Map<String, String>> verifyGooglePlay(
            @RequestBody Map<String, String> body) throws Exception {
        String productId = body.get("productId");
        String purchaseToken = body.get("purchaseToken");

        if (productId == null || purchaseToken == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "productId and purchaseToken required"));
        }

        User user = SecurityUtils.getCurrentUser();
        boolean activated = googlePlayService.verifyAndActivate(user, productId, purchaseToken);

        if (activated) {
            return ResponseEntity.ok(Map.of("status", "pro", "message", "Subscription activated"));
        } else {
            return ResponseEntity.status(402).body(Map.of("message", "Purchase could not be verified"));
        }
    }
}
