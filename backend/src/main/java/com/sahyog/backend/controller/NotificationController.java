package com.sahyog.backend.controller;

import com.sahyog.backend.model.NotificationItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class NotificationController {

    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>> getNotifications() {
        NotificationItem item = new NotificationItem(
                "NOTIF-01",
                "Assignment Update",
                "Worker Suresh Kumar assigned to request REQ-1042",
                false,
                Instant.now().toString()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notifications", List.of(item));

        return ResponseEntity.ok(response);
    }
}
