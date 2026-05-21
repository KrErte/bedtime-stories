package me.storyfor.backend.repository;

import me.storyfor.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByAuthProviderAndAuthProviderId(String provider, String providerId);
    Optional<User> findByStripeCustomerId(String stripeCustomerId);
    Optional<User> findByPasswordResetToken(String token);
}
