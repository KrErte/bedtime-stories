package me.storyfor.backend.service;

import me.storyfor.backend.dto.StoryDto;
import me.storyfor.backend.dto.StoryRequest;
import me.storyfor.backend.entity.Child;
import me.storyfor.backend.entity.Story;
import me.storyfor.backend.entity.User;
import me.storyfor.backend.repository.ChildRepository;
import me.storyfor.backend.repository.StoryRepository;
import me.storyfor.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final ChildRepository childRepository;
    private final UserRepository userRepository;
    private final ClaudeService claudeService;
    private final IllustrationService illustrationService;
    private final AudioService audioService;

    public StoryService(StoryRepository storyRepository, ChildRepository childRepository,
                        UserRepository userRepository, ClaudeService claudeService,
                        IllustrationService illustrationService, AudioService audioService) {
        this.storyRepository = storyRepository;
        this.childRepository = childRepository;
        this.userRepository = userRepository;
        this.claudeService = claudeService;
        this.illustrationService = illustrationService;
        this.audioService = audioService;
    }

    @Transactional
    public StoryDto generateStory(User user, StoryRequest request) {
        boolean isPro = "pro".equals(user.getSubscriptionStatus());

        // Reset daily counter if new day
        if (user.getLastStoryDate() == null || !user.getLastStoryDate().equals(LocalDate.now())) {
            user.setStoriesGeneratedToday(0);
            user.setLastStoryDate(LocalDate.now());
        }

        // Check quotas
        if (!isPro && user.getStoriesGeneratedToday() >= 1) {
            throw new IllegalStateException("Free users can generate 1 story per day. Upgrade to Pro for unlimited stories!");
        }
        if (isPro && user.getStoriesGeneratedToday() >= 20) {
            throw new IllegalStateException("Daily limit of 20 stories reached. Please try again tomorrow.");
        }

        Child child = childRepository.findById(request.childId())
                .orElseThrow(() -> new RuntimeException("Child not found"));
        if (!child.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        String theme = request.theme() != null ? request.theme() : "adventure";
        int wordCount = isPro ? 550 : 200;
        String interests = child.getInterests() != null ? String.join(", ", child.getInterests()) : "stories";

        // Generate story text
        String language = request.language() != null ? request.language() : "English";

        String rawStory = claudeService.generateStory(
                child.getName(), child.getAge(),
                child.getGender(), interests, theme,
                child.getFavoriteAnimal(), wordCount, language);

        // Parse title and content
        String title;
        String content;
        int firstNewline = rawStory.indexOf("\n");
        if (firstNewline > 0) {
            title = rawStory.substring(0, firstNewline).trim();
            content = rawStory.substring(firstNewline).trim();
        } else {
            title = child.getName() + "'s Bedtime Adventure";
            content = rawStory;
        }

        // Get illustrations
        String illustrationTheme = illustrationService.getIllustrationTheme(theme);
        List<String> illustrations = illustrationService.getIllustrations(theme, isPro);

        // Create story
        Story story = new Story();
        story.setUserId(user.getId());
        story.setChildId(child.getId());
        story.setTitle(title);
        story.setContent(content);
        story.setContentWordCount(content.split("\s+").length);
        story.setStoryTheme(theme);
        story.setIllustrationTheme(illustrationTheme);
        story.setIllustrationUrls(illustrations);
        story.setLanguage(language);
        story = storyRepository.save(story);

        // Generate audio for Pro users
        if (isPro) {
            String audioPath = audioService.generateAndSave(story.getId(), content, request.voice());
            if (audioPath != null) {
                story.setAudioUrl(audioPath);
                story = storyRepository.save(story);
            }
        }

        // Update user counters
        user.setStoriesGeneratedToday(user.getStoriesGeneratedToday() + 1);
        user.setStoriesGeneratedTotal(user.getStoriesGeneratedTotal() + 1);
        user.setLastStoryDate(LocalDate.now());
        userRepository.save(user);

        return StoryDto.from(story);
    }

    public Page<StoryDto> getStories(UUID userId, UUID childId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Story> stories;
        if (childId != null) {
            stories = storyRepository.findByUserIdAndChildIdOrderByCreatedAtDesc(userId, childId, pageRequest);
        } else {
            stories = storyRepository.findByUserIdOrderByCreatedAtDesc(userId, pageRequest);
        }
        return stories.map(StoryDto::from);
    }

    public Page<StoryDto> getFavorites(UUID userId, int page, int size) {
        return storyRepository.findByUserIdAndIsFavoriteTrueOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
                .map(StoryDto::from);
    }

    public StoryDto getStory(UUID userId, UUID storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        if (!story.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        return StoryDto.from(story);
    }

    public StoryDto toggleFavorite(UUID userId, UUID storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        if (!story.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        story.setIsFavorite(!Boolean.TRUE.equals(story.getIsFavorite()));
        return StoryDto.from(storyRepository.save(story));
    }

    public void deleteStory(UUID userId, UUID storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        if (!story.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized");
        }
        storyRepository.delete(story);
    }
}
