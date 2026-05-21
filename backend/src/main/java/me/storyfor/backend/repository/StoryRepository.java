package me.storyfor.backend.repository;

import me.storyfor.backend.entity.Story;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, UUID> {
    Page<Story> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    Page<Story> findByUserIdAndChildIdOrderByCreatedAtDesc(UUID userId, UUID childId, Pageable pageable);
    Page<Story> findByUserIdAndIsFavoriteTrueOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}
