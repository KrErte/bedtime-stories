package me.storyfor.backend.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record StoryRequest(
    @NotNull UUID childId,
    String theme,
    String voice,
    String language
) {}
