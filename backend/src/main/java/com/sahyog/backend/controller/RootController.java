package com.sahyog.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> getRootInfo() {
        Map<String, String> response = new HashMap<>();
        response.put("name", "Sahyog (सहयोग) Cooperative Gig Services Platform REST API");
        response.put("status", "online");
        response.put("documentation", "/api/v1/health");
        return ResponseEntity.ok(response);
    }
}
