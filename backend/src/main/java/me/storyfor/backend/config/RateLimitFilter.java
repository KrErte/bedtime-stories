package me.storyfor.backend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * IP-based rate limiting with TTL eviction to prevent unbounded memory growth.
 *
 * NOTE: This in-process store is intentionally simple for single-instance
 * deployments. For multi-replica / Kubernetes setups replace the bucket store
 * with a Redis-backed Bucket4j proxy (bucket4j-redis or bucket4j-caffeine-redis).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final long CLEANUP_INTERVAL_MS = 5 * 60 * 1000L;  // 5 minutes
    private static final long BUCKET_TTL_MS       = 60 * 60 * 1000L; // 1 hour idle → evict

    private final Map<String, Bucket> buckets  = new ConcurrentHashMap<>();
    private final Map<String, Long>   lastSeen = new ConcurrentHashMap<>();
    private volatile long lastCleanup = System.currentTimeMillis();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String ip   = request.getRemoteAddr();
        String key;
        Bucket bucket;

        if (path.startsWith("/api/auth/")) {
            key    = "auth:" + ip;
            bucket = buckets.computeIfAbsent(key, k -> Bucket.builder()
                    .addLimit(Bandwidth.simple(5, Duration.ofMinutes(1)))
                    .build());
        } else if (path.startsWith("/api/stories/generate")) {
            key    = "story:" + ip;
            bucket = buckets.computeIfAbsent(key, k -> Bucket.builder()
                    .addLimit(Bandwidth.simple(3, Duration.ofMinutes(1)))
                    .build());
        } else {
            key    = "general:" + ip;
            bucket = buckets.computeIfAbsent(key, k -> Bucket.builder()
                    .addLimit(Bandwidth.simple(60, Duration.ofMinutes(1)))
                    .build());
        }

        lastSeen.put(key, System.currentTimeMillis());
        evictStaleBucketsIfNeeded();

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\":429,\"message\":\"Too many requests\"}");
        }
    }

    private void evictStaleBucketsIfNeeded() {
        long now = System.currentTimeMillis();
        if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
        lastCleanup = now;
        lastSeen.entrySet().removeIf(e -> now - e.getValue() > BUCKET_TTL_MS);
        buckets.keySet().retainAll(lastSeen.keySet());
    }
}
