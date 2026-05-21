package me.storyfor.backend.entity;

import jakarta.persistence.*;
import me.storyfor.backend.config.StringListConverter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "stories")
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "child_id", nullable = false)
    private UUID childId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "text", nullable = false)
    private String content;

    @Column(name = "content_word_count", nullable = false)
    private Integer contentWordCount;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "audio_duration_seconds")
    private Integer audioDurationSeconds;

    @Column(name = "illustration_theme")
    private String illustrationTheme;

    @Convert(converter = StringListConverter.class)
    @Column(name = "illustration_urls", length = 4000)
    private List<String> illustrationUrls;

    @Column(name = "language")
    private String language = "en";

    @Column(name = "story_theme")
    private String storyTheme;

    @Column(name = "is_favorite")
    private Boolean isFavorite = false;

    @Column(name = "ai_model")
    private String aiModel = "claude-haiku-4-5";

    @Column(name = "tts_model")
    private String ttsModel = "openai-tts-1";

    @Column(name = "generation_cost_cents")
    private Integer generationCostCents;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getChildId() { return childId; }
    public void setChildId(UUID childId) { this.childId = childId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getContentWordCount() { return contentWordCount; }
    public void setContentWordCount(Integer contentWordCount) { this.contentWordCount = contentWordCount; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public Integer getAudioDurationSeconds() { return audioDurationSeconds; }
    public void setAudioDurationSeconds(Integer audioDurationSeconds) { this.audioDurationSeconds = audioDurationSeconds; }
    public String getIllustrationTheme() { return illustrationTheme; }
    public void setIllustrationTheme(String illustrationTheme) { this.illustrationTheme = illustrationTheme; }
    public List<String> getIllustrationUrls() { return illustrationUrls; }
    public void setIllustrationUrls(List<String> illustrationUrls) { this.illustrationUrls = illustrationUrls; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getStoryTheme() { return storyTheme; }
    public void setStoryTheme(String storyTheme) { this.storyTheme = storyTheme; }
    public Boolean getIsFavorite() { return isFavorite; }
    public void setIsFavorite(Boolean isFavorite) { this.isFavorite = isFavorite; }
    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
    public String getTtsModel() { return ttsModel; }
    public void setTtsModel(String ttsModel) { this.ttsModel = ttsModel; }
    public Integer getGenerationCostCents() { return generationCostCents; }
    public void setGenerationCostCents(Integer generationCostCents) { this.generationCostCents = generationCostCents; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
