package me.storyfor.backend.controller;

import me.storyfor.backend.service.ClaudeService;
import me.storyfor.backend.service.IllustrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    private final ClaudeService claudeService;
    private final IllustrationService illustrationService;

    public DemoController(ClaudeService claudeService, IllustrationService illustrationService) {
        this.claudeService = claudeService;
        this.illustrationService = illustrationService;
    }

    @GetMapping("/story")
    public ResponseEntity<Map<String, Object>> demoStory(
            @RequestParam(defaultValue = "Luna") String childName,
            @RequestParam(defaultValue = "5") int age,
            @RequestParam(defaultValue = "adventure") String theme) {
        String rawStory = claudeService.generateStory(childName, age, "child", "animals, stars", theme, null, 200, "English");
        String title;
        String content;
        int idx = rawStory.indexOf("\n");
        if (idx > 0) {
            title = rawStory.substring(0, idx).trim();
            content = rawStory.substring(idx).trim();
        } else {
            title = childName + "'s Bedtime Adventure";
            content = rawStory;
        }
        List<String> illustrations = illustrationService.getIllustrations(theme, false);
        return ResponseEntity.ok(Map.of(
                "title", title,
                "content", content,
                "illustrationUrls", illustrations,
                "wordCount", content.split("\\s+").length
        ));
    }
}
