package com.sahyog.backend.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahyog.backend.model.UserRole;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AuthFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (path.equals("/") || path.equals("/api/v1/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        String roleHeader = request.getHeader("x-user-role");
        String userIdHeader = request.getHeader("x-user-id");
        String userNameHeader = request.getHeader("x-user-name");

        UserRole role = UserRole.CONSUMER;
        if (roleHeader != null && !roleHeader.trim().isEmpty()) {
            try {
                role = UserRole.valueOf(roleHeader.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                // If invalid role passed, default or handle
                role = UserRole.CONSUMER;
            }
        }

        String userId = (userIdHeader != null && !userIdHeader.trim().isEmpty()) ? userIdHeader : "user-anon";
        String userName = (userNameHeader != null && !userNameHeader.trim().isEmpty()) ? userNameHeader : "User";

        request.setAttribute("userRole", role);
        request.setAttribute("userId", userId);
        request.setAttribute("userName", userName);

        // Route protection checks
        if (isForbidden(path, request.getMethod(), role)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");

            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("success", false);
            errorBody.put("error", "Forbidden: Role '" + role.name() + "' is not authorized to perform this operation.");

            response.getWriter().write(objectMapper.writeValueAsString(errorBody));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isForbidden(String path, String method, UserRole role) {
        // /requests, /requests/{id}/cancel, /complaints (POST), /ratings -> CONSUMER or MEMBER
        if (path.equals("/api/v1/requests") && method.equalsIgnoreCase("POST")) {
            return !(role == UserRole.CONSUMER || role == UserRole.MEMBER);
        }
        if (path.matches("^/api/v1/requests/[^/]+/cancel$") && method.equalsIgnoreCase("POST")) {
            return !(role == UserRole.CONSUMER || role == UserRole.MEMBER);
        }
        if (path.equals("/api/v1/complaints") && method.equalsIgnoreCase("POST")) {
            return !(role == UserRole.CONSUMER || role == UserRole.MEMBER);
        }
        if (path.equals("/api/v1/ratings") && method.equalsIgnoreCase("POST")) {
            return !(role == UserRole.CONSUMER || role == UserRole.MEMBER);
        }

        // Admin routes -> COOPERATIVE_ADMIN or PLATFORM_AUTHORITY
        if (path.equals("/api/v1/admin/dashboard-stats") ||
            path.matches("^/api/v1/requests/[^/]+/candidates$") ||
            path.matches("^/api/v1/requests/[^/]+/assign$") ||
            (path.equals("/api/v1/complaints") && method.equalsIgnoreCase("GET")) ||
            path.matches("^/api/v1/complaints/[^/]+/resolve$") ||
            path.equals("/api/v1/audit-logs")) {
            return !(role == UserRole.COOPERATIVE_ADMIN || role == UserRole.PLATFORM_AUTHORITY);
        }

        // Worker routes -> WORKER
        if (path.equals("/api/v1/worker/jobs") ||
            path.matches("^/api/v1/jobs/[^/]+/accept$") ||
            path.matches("^/api/v1/jobs/[^/]+/reject$") ||
            path.matches("^/api/v1/jobs/[^/]+/start$") ||
            path.matches("^/api/v1/jobs/[^/]+/complete$") ||
            path.equals("/api/v1/worker/earnings")) {
            return !(role == UserRole.WORKER);
        }

        // Worker welfare -> WORKER or COOPERATIVE_ADMIN
        if (path.equals("/api/v1/worker/welfare")) {
            return !(role == UserRole.WORKER || role == UserRole.COOPERATIVE_ADMIN);
        }

        return false;
    }
}
