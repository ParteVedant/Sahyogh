package com.sahyog.backend.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final long WINDOW_MS = 60 * 1000; // 1 minute
    private static final int MAX_REQUESTS = 1000;

    private static class RateLimitState {
        int count;
        long resetTime;

        RateLimitState(int count, long resetTime) {
            this.count = count;
            this.resetTime = resetTime;
        }
    }

    private final Map<String, RateLimitState> store = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (!path.startsWith("/api/v1")) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = request.getRemoteAddr();
        if (ip == null || ip.isEmpty()) {
            ip = "global-client";
        }

        long now = System.currentTimeMillis();

        RateLimitState state = store.compute(ip, (key, existing) -> {
            if (existing == null || now > existing.resetTime) {
                return new RateLimitState(1, now + WINDOW_MS);
            } else {
                existing.count += 1;
                return existing;
            }
        });

        int remaining = Math.max(0, MAX_REQUESTS - state.count);
        response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));

        if (state.count > MAX_REQUESTS) {
            response.setStatus(429); // 429 Too Many Requests
            response.setContentType("application/json");

            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("success", false);
            errorBody.put("error", "Too Many Requests. Rate limit exceeded. Please wait a minute before retrying.");

            response.getWriter().write(objectMapper.writeValueAsString(errorBody));
            return;
        }

        filterChain.doFilter(request, response);
    }
}
