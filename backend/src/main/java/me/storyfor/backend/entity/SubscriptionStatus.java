package me.storyfor.backend.entity;

/**
 * Lowercase names intentionally match the DB column values so that
 * @Enumerated(EnumType.STRING) stores/reads them without a converter.
 */
public enum SubscriptionStatus {
    free,
    pro,
    cancelled,
    trialing;

    public boolean isPro() {
        return this == pro || this == trialing;
    }
}
