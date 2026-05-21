package me.storyfor.backend.repository;

import me.storyfor.backend.entity.SubscriptionEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SubscriptionEventRepository extends JpaRepository<SubscriptionEvent, UUID> {
    boolean existsByStripeEventId(String stripeEventId);
}
