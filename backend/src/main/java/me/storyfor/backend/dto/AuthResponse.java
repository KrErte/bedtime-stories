package me.storyfor.backend.dto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    UserDto user
) {}
