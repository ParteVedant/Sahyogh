package com.sahyog.backend.controller;

import com.sahyog.backend.dto.ApiResponse;
import com.sahyog.backend.dto.AssignWorkerDTO;
import com.sahyog.backend.model.*;
import com.sahyog.backend.service.MatchingService;
import com.sahyog.backend.service.SupabaseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AdminController {

    private final MatchingService matchingService;
    private final SupabaseService supabaseService;

    @Autowired
    public AdminController(MatchingService matchingService, SupabaseService supabaseService) {
        this.matchingService = matchingService;
        this.supabaseService = supabaseService;
    }

    @GetMapping("/admin/dashboard-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminDashboardStats() {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("newRequests", Map.of("count", 12, "subtext", "up 3 since yesterday"));
        kpis.put("activeJobs", Map.of("count", 8, "subtext", "on schedule"));
        kpis.put("availableWorkers", Map.of("count", 34, "subtext", "across 6 skills"));
        kpis.put("completedToday", Map.of("count", 26, "subtext", "target 24"));
        kpis.put("workersBusy", Map.of("count", 21, "subtext", "avg. 2.3 jobs each"));
        kpis.put("pendingAssignments", Map.of("count", 5, "subtext", "needs review"));

        Map<String, Object> workforceStatus = new HashMap<>();
        workforceStatus.put("available", Map.of("count", 34, "percentage", 65));
        workforceStatus.put("busy", Map.of("count", 21, "percentage", 40));
        workforceStatus.put("offline", Map.of("count", 28, "percentage", 50));

        Map<String, Object> data = new HashMap<>();
        data.put("kpis", kpis);
        data.put("workforceStatus", workforceStatus);

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/requests/{id}/candidates")
    public ResponseEntity<Map<String, Object>> getRequestCandidates(@PathVariable String id) {
        ServiceRequest dummyReq = new ServiceRequest();
        dummyReq.setId(id);
        dummyReq.setCategoryId("plumbing");
        dummyReq.setCategoryName("Plumbing Repairs");
        dummyReq.setTitle("Pipe leakage repair");
        dummyReq.setProblemDescription("Bathroom pipe is leaking near the sink.");
        dummyReq.setConsumerName("Rahul Sharma");
        dummyReq.setConsumerPhone("+91 98199 88776");
        dummyReq.setAddress(new ServiceAddress("Flat 402", "Thane", "Thane", "400601"));
        dummyReq.setStatus(RequestStatus.ASSIGNMENT_PENDING);
        dummyReq.setPreferredDate("2026-08-28");
        dummyReq.setPreferredTimeSlot("10:00 AM");
        dummyReq.setCreatedAt(Instant.now().toString());

        List<CandidateScore> candidates = matchingService.calculateCandidateScores(dummyReq);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("matchingEngineVersion", "V2.0");
        response.put("recommendedCandidate", candidates.isEmpty() ? null : candidates.get(0));
        response.put("otherCandidates", candidates.size() > 1 ? candidates.subList(1, candidates.size()) : List.of());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests/{id}/assign")
    public ResponseEntity<ApiResponse<Map<String, Object>>> assignWorkerToRequest(
            @PathVariable String id,
            @Valid @RequestBody AssignWorkerDTO body,
            HttpServletRequest request) {

        String userName = (String) request.getAttribute("userName");
        if (userName == null || userName.isEmpty()) {
            userName = "Meera Kulkarni";
        }

        supabaseService.updateServiceRequest(id, "assigned_worker_id", body.getWorkerId());

        Map<String, Object> data = new HashMap<>();
        data.put("requestId", id);
        data.put("assignedWorkerId", body.getWorkerId());
        data.put("status", "WORKER_ASSIGNED");
        data.put("assignedAt", Instant.now().toString());

        String message = "Worker " + body.getWorkerId() + " manually assigned to request " + id + " by Administrator " + userName + ".";

        return ResponseEntity.ok(ApiResponse.success(message, data));
    }
}
