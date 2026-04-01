package me.storyfor.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    private final String apiKey;
    private final String fromEmail;

    public EmailService(@Value("${resend.api-key}") String apiKey,
                        @Value("${resend.from-email}") String fromEmail) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
    }

    public void sendPasswordResetEmail(String to, String name, String resetLink) {
        String html = """
                <h2>Reset Your Password</h2>
                <p>Hi %s,</p>
                <p>Click the link below to reset your password:</p>
                <a href="%s" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't request this, ignore this email.</p>
                """.formatted(name != null ? name : "there", resetLink);
        sendEmail(to, "Reset your StoryFor.me password", html);
    }

    private void sendEmail(String to, String subject, String html) {
        if (apiKey == null || apiKey.isBlank()) return;
        try {
            String json = """
                    {"from":"%s","to":["%s"],"subject":"%s","html":"%s"}
                    """.formatted(fromEmail, to, subject, html.replace("\"", "\\\"").replace("\n", ""));
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
            HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
