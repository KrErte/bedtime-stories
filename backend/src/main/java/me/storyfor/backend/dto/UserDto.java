package me.storyfor.backend.dto;

import me.storyfor.backend.entity.User;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String name,
    String subscriptionStatus,
    int storiesGeneratedToday,
    int storiesGeneratedTotal
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getSubscriptionStatus(),
            user.getStoriesGeneratedToday() != null ? user.getStoriesGeneratedToday() : 0,
            user.getStoriesGeneratedTotal() != null ? user.getStoriesGeneratedTotal() : 0
        );
    }
}
