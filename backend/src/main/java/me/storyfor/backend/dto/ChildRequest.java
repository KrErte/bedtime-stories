package me.storyfor.backend.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public record ChildRequest(
    @NotBlank @Size(max = 100) String name,
    @NotNull @Min(1) @Max(12) Integer age,
    String gender,
    List<String> interests,
    String favoriteAnimal
) {}
