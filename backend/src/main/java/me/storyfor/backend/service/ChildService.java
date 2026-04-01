package me.storyfor.backend.service;

import me.storyfor.backend.dto.ChildDto;
import me.storyfor.backend.dto.ChildRequest;
import me.storyfor.backend.entity.Child;
import me.storyfor.backend.repository.ChildRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ChildService {

    private final ChildRepository childRepository;

    public ChildService(ChildRepository childRepository) {
        this.childRepository = childRepository;
    }

    public List<ChildDto> getChildren(UUID userId) {
        return childRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(ChildDto::from).toList();
    }

    public ChildDto createChild(UUID userId, ChildRequest request) {
        if (childRepository.countByUserId(userId) >= 5) {
            throw new IllegalStateException("Maximum 5 children allowed");
        }
        Child child = new Child();
        child.setUserId(userId);
        child.setName(request.name());
        child.setAge(request.age());
        child.setGender(request.gender());
        child.setInterests(request.interests());
        child.setFavoriteAnimal(request.favoriteAnimal());
        return ChildDto.from(childRepository.save(child));
    }

    public ChildDto updateChild(UUID userId, UUID childId, ChildRequest request) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        if (!child.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        child.setName(request.name());
        child.setAge(request.age());
        child.setGender(request.gender());
        child.setInterests(request.interests());
        child.setFavoriteAnimal(request.favoriteAnimal());
        return ChildDto.from(childRepository.save(child));
    }

    public void deleteChild(UUID userId, UUID childId) {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        if (!child.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        childRepository.delete(child);
    }
}
