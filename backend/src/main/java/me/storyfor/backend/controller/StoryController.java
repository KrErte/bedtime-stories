package me.storyfor.backend.controller;

import jakarta.validation.Valid;
import me.storyfor.backend.dto.StoryDto;
import me.storyfor.backend.dto.StoryRequest;
import me.storyfor.backend.entity.Story;
import me.storyfor.backend.entity.User;
import me.storyfor.backend.repository.StoryRepository;
import me.storyfor.backend.security.SecurityUtils;
import me.storyfor.backend.service.AudioService;
import me.storyfor.backend.service.PdfService;
import me.storyfor.backend.service.StoryService;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryService storyService;
    private final AudioService audioService;
    private final PdfService pdfService;
    private final StoryRepository storyRepository;

    public StoryController(StoryService storyService, AudioService audioService,
                           PdfService pdfService, StoryRepository storyRepository) {
        this.storyService = storyService;
        this.audioService = audioService;
        this.pdfService = pdfService;
        this.storyRepository = storyRepository;
    }

    @PostMapping("/generate")
    public ResponseEntity<StoryDto> generate(@Valid @RequestBody StoryRequest request) {
        User user = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(storyService.generateStory(user, request));
    }

    @GetMapping
    public ResponseEntity<Page<StoryDto>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) UUID childId) {
        UUID userId = SecurityUtils.getCurrentUser().getId();
        return ResponseEntity.ok(storyService.getStories(userId, childId, page, size));
    }

    @GetMapping("/favorites")
    public ResponseEntity<Page<StoryDto>> favorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(storyService.getFavorites(SecurityUtils.getCurrentUser().getId(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryDto> get(@PathVariable UUID id) {
        return ResponseEntity.ok(storyService.getStory(SecurityUtils.getCurrentUser().getId(), id));
    }

    @PutMapping("/{id}/favorite")
    public ResponseEntity<StoryDto> toggleFavorite(@PathVariable UUID id) {
        return ResponseEntity.ok(storyService.toggleFavorite(SecurityUtils.getCurrentUser().getId(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        storyService.deleteStory(SecurityUtils.getCurrentUser().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/audio")
    public ResponseEntity<byte[]> audio(@PathVariable UUID id) throws IOException {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Story not found"));
        if (!story.getUserId().equals(SecurityUtils.getCurrentUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        Path audioPath = audioService.getAudioPath(id);
        if (!Files.exists(audioPath)) {
            return ResponseEntity.notFound().build();
        }
        byte[] audioBytes = Files.readAllBytes(audioPath);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .contentLength(audioBytes.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"story.mp3\"")
                .body(audioBytes);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable UUID id) {
        Story story = storyRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Story not found"));
        if (!story.getUserId().equals(SecurityUtils.getCurrentUser().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        byte[] pdfBytes = pdfService.generatePdf(story);
        String safeTitle = story.getTitle().replaceAll("[^a-zA-Z0-9\\-_ ]", "");
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeTitle + ".pdf\"")
                .body(pdfBytes);
    }
}
