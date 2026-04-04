package me.storyfor.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ClaudeService {

    private final String apiKey;
    private final String model;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ClaudeService(@Value("${anthropic.api-key}") String apiKey,
                         @Value("${anthropic.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    public String generateStory(String childName, int age, String gender, String interests,
                                 String theme, String favoriteAnimal, int wordCount, String language) {
        String lang = language != null ? language : "English";
        String systemPrompt = """
                You are a children's bedtime story writer. You write warm, calming, \
                age-appropriate stories that help children fall asleep. The stories \
                always have a positive message and a peaceful ending.

                Rules:
                - Write the ENTIRE story in %s
                - The child named %s is ALWAYS the main character
                - Age-appropriate language for a %d-year-old
                - Include the child's interests: %s
                - Story theme: %s
                - Word count: approximately %d words
                - Structure: beginning → small adventure → gentle resolution → sleepy ending
                - End with the child falling asleep in the story
                - Tone: warm, magical, soothing
                - No scary elements, no villains, no conflict that isn't resolved
                - Include sensory details (soft blankets, warm light, gentle breeze)
                - Return ONLY the story title on the first line, then a blank line, then the story text. No other formatting.
                """.formatted(lang, childName, age, interests, theme, wordCount);

        String userPrompt = "Write a bedtime story in %s for %s, a %d-year-old %s who loves %s. Tonight's theme is %s.%s"
                .formatted(lang, childName, age, gender != null ? gender : "child", interests, theme,
                        favoriteAnimal != null ? " Include their favorite animal: " + favoriteAnimal + "." : "");

        try {
            String json = objectMapper.writeValueAsString(new java.util.HashMap<>() {{
                put("model", model);
                put("max_tokens", 2048);
                put("system", systemPrompt);
                put("messages", new Object[]{new java.util.HashMap<>() {{
                    put("role", "user");
                    put("content", userPrompt);
                }}});
            }});

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.anthropic.com/v1/messages"))
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode root = objectMapper.readTree(response.body());
            return root.path("content").get(0).path("text").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate story: " + e.getMessage(), e);
        }
    }
}
