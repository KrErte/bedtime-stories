package me.storyfor.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class AudioService {

    private final String apiKey;
    private final String storagePath;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final java.util.Map<String, String> VOICE_MAP = java.util.Map.of(
        "luna", "nova", "atlas", "echo", "willow", "shimmer", "sage", "fable"
    );

    public AudioService(@Value("${openai.api-key}") String apiKey,
                         @Value("${audio.storage-path}") String storagePath) {
        this.apiKey = apiKey;
        this.storagePath = storagePath;
    }

    public String generateAndSave(UUID storyId, String text, String voiceName) {
        if (apiKey == null || apiKey.isBlank()) return null;
        String voice = VOICE_MAP.getOrDefault(voiceName != null ? voiceName.toLowerCase() : "luna", "nova");

        try {
            Path dir = Paths.get(storagePath);
            Files.createDirectories(dir);
            Path audioFile = dir.resolve(storyId + ".mp3");

            // Split text into chunks if > 4096 chars
            java.util.List<byte[]> chunks = new java.util.ArrayList<>();
            int maxChars = 4096;
            for (int i = 0; i < text.length(); i += maxChars) {
                String chunk = text.substring(i, Math.min(i + maxChars, text.length()));
                chunks.add(callTtsApi(chunk, voice));
            }

            // Concatenate chunks
            try (var out = Files.newOutputStream(audioFile)) {
                for (byte[] chunk : chunks) {
                    out.write(chunk);
                }
            }
            return audioFile.toString();
        } catch (Exception e) {
            System.err.println("Audio generation failed: " + e.getMessage());
            return null;
        }
    }

    private byte[] callTtsApi(String text, String voice) throws IOException, InterruptedException {
        String json = objectMapper.writeValueAsString(new java.util.HashMap<>() {{
            put("model", "tts-1");
            put("input", text);
            put("voice", voice);
            put("response_format", "mp3");
        }});

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/audio/speech"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<byte[]> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofByteArray());
        if (response.statusCode() != 200) {
            throw new RuntimeException("TTS API error: " + response.statusCode());
        }
        return response.body();
    }

    public Path getAudioPath(UUID storyId) {
        return Paths.get(storagePath, storyId + ".mp3");
    }
}
