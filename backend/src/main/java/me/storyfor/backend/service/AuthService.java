package me.storyfor.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import me.storyfor.backend.dto.*;
import me.storyfor.backend.entity.User;
import me.storyfor.backend.repository.UserRepository;
import me.storyfor.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final String googleClientId;
    private final String appUrl;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, EmailService emailService,
                       @Value("${google.client-id}") String googleClientId,
                       @Value("${app.url}") String appUrl) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.googleClientId = googleClientId;
        this.appUrl = appUrl;
    }

    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setAuthProvider("local");
        user.setSubscriptionStatus("free");
        user.setStoriesGeneratedToday(0);
        user.setStoriesGeneratedTotal(0);
        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return buildAuthResponse(user);
    }

    public AuthResponse googleAuth(GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();
            GoogleIdToken idToken = verifier.verify(request.idToken());
            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google ID token");
            }
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String googleId = payload.getSubject();

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setAuthProvider("google");
                newUser.setAuthProviderId(googleId);
                newUser.setSubscriptionStatus("free");
                newUser.setStoriesGeneratedToday(0);
                newUser.setStoriesGeneratedTotal(0);
                return userRepository.save(newUser);
            });
            return buildAuthResponse(user);
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed", e);
        }
    }

    public AuthResponse refresh(RefreshRequest request) {
        if (!jwtService.isTokenValid(request.refreshToken()) || !jwtService.isRefreshToken(request.refreshToken())) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        UUID userId = jwtService.getUserIdFromToken(request.refreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildAuthResponse(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetExpiresAt(Instant.now().plusSeconds(3600));
            userRepository.save(user);
            String resetLink = appUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetLink);
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.token())
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));
        if (user.getPasswordResetExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getId());
        return new AuthResponse(accessToken, refreshToken, UserDto.from(user));
    }
}
