package com.sahyog.backend.controller;

import com.sahyog.backend.dto.ApiResponse;
import com.sahyog.backend.model.AuditLog;
import com.sahyog.backend.model.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AuditController {

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        List<AuditLog> logs = List.of(
                new AuditLog(
                        "LOG-001",
                        "ASSIGN_WORKER",
                        "Meera Kulkarni",
                        UserRole.COOPERATIVE_ADMIN,
                        "Assigned Suresh Kumar (W-042) to request REQ-1042",
                        Instant.now().toString()
                ),
                new AuditLog(
                        "LOG-002",
                        "ACCEPT_JOB",
                        "Suresh Kumar",
                        UserRole.WORKER,
                        "Accepted assignment for job REQ-1042",
                        Instant.now().toString()
                )
        );

        ApiResponse<List<AuditLog>> response = ApiResponse.success(logs);
        response.setCount(logs.size());
        return ResponseEntity.ok(response);
    }
}
