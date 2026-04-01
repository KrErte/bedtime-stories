package me.storyfor.backend.dto;

import me.storyfor.backend.entity.Child;
import java.util.List;
import java.util.UUID;

public record ChildDto(
    UUID id,
    String name,
    int age,
    String gender,
    List<String> interests,
    String favoriteAnimal
) {
    public static ChildDto from(Child child) {
        return new ChildDto(
            child.getId(),
            child.getName(),
            child.getAge(),
            child.getGender(),
            child.getInterests(),
            child.getFavoriteAnimal()
        );
    }
}
