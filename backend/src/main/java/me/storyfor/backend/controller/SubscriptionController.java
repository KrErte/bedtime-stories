package me.storyfor.backend.controller;

import me.storyfor.backend.entity.User;
import me.storyfor.backend.security.SecurityUtils;
import me.storyfor.backend.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final StripeService stripeService;

    public SubscriptionController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> checkout() throws Exception {
        User user = SecurityUtils.getCurrentUser();
        String url = stripeService.createCheckoutSession(user);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> status() {
        User user = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(Map.of("status", user.getSubscriptionStatus()));
    }

    @PostMapping("/cancel")
    public ResponseEntity<Map<String, String>> cancel() throws Exception {
        User user = SecurityUtils.getCurrentUser();
        stripeService.cancelSubscription(user);
        return ResponseEntity.ok(Map.of("message", "Subscription cancelled"));
    }
}
