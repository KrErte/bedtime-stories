package me.storyfor.backend.dto;

import me.storyfor.backend.entity.Story;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record StoryDto(
    UUID id,
    UUID childId,
    String title,
    String content,
    int contentWordCount,
    String audioUrl,
    Integer audioDurationSeconds,
    String illustrationTheme,
    List<String> illustrationUrls,
    String storyTheme,
    boolean isFavorite,
    Instant createdAt
) {
    public static StoryDto from(Story story) {
        return new StoryDto(
            story.getId(),
            story.getChildId(),
            story.getTitle(),
            story.getContent(),
            story.getContentWordCount(),
            story.getAudioUrl() != null ? "/api/stories/" + story.getId() + "/audio" : null,
            story.getAudioDurationSeconds(),
            story.getIllustrationTheme(),
            story.getIllustrationUrls(),
            story.getStoryTheme(),
            Boolean.TRUE.equals(story.getIsFavorite()),
            story.getCreatedAt()
        );
    }
}
