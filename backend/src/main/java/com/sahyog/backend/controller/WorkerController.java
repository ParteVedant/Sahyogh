package com.sahyog.backend.controller;

import com.sahyog.backend.dto.ApiResponse;
import com.sahyog.backend.dto.CompleteJobDTO;
import com.sahyog.backend.dto.RejectJobDTO;
import com.sahyog.backend.model.ServiceAddress;
import com.sahyog.backend.service.SupabaseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class WorkerController {

    private final SupabaseService supabaseService;

    @Autowired
    public WorkerController(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    @GetMapping("/worker/jobs")
    public ResponseEntity<Map<String, Object>> getWorkerJobs(HttpServletRequest request) {
        String workerId = (String) request.getAttribute("userId");
        if (workerId == null || workerId.isEmpty()) {
            workerId = "worker-1";
        }

        Map<String, Object> job1 = new HashMap<>();
        job1.put("id", "REQ-1042");
        job1.put("categoryId", "plumbing");
        job1.put("categoryName", "Plumbing Repairs");
        job1.put("title", "Pipe leakage repair");
        job1.put("problemDescription", "Bathroom pipe is leaking near the sink.");
        job1.put("consumerName", "Rahul Sharma");
        job1.put("consumerPhone", "+91 98199 88776");
        job1.put("address", new ServiceAddress("Flat 402, Building A", "Thane", "Thane", "400601"));
        job1.put("status", "WORKER_ASSIGNED");
        job1.put("preferredDate", "2026-08-28");
        job1.put("preferredTimeSlot", "10:00 AM");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("workerId", workerId);
        response.put("assignedJobs", List.of(job1));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/jobs/{id}/accept")
    public ResponseEntity<Map<String, Object>> acceptWorkerJob(@PathVariable String id) {
        supabaseService.updateServiceRequest(id, "status", "WORKER_ACCEPTED");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Job " + id + " accepted by worker.");
        response.put("status", "WORKER_ACCEPTED");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/jobs/{id}/reject")
    public ResponseEntity<Map<String, Object>> rejectWorkerJob(
            @PathVariable String id,
            @Valid @RequestBody RejectJobDTO body) {

        supabaseService.updateServiceRequest(id, "status", "REJECTED");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Job " + id + " rejected. Reason: '" + body.getReason() + "'. Request returned to Admin queue for reassignment.");
        response.put("status", "REJECTED");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/jobs/{id}/start")
    public ResponseEntity<Map<String, Object>> startWorkerJob(@PathVariable String id) {
        supabaseService.updateServiceRequest(id, "status", "IN_PROGRESS");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Service execution started for job " + id + ".");
        response.put("status", "IN_PROGRESS");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/jobs/{id}/complete")
    public ResponseEntity<Map<String, Object>> completeWorkerJob(
            @PathVariable String id,
            @Valid @RequestBody CompleteJobDTO body) {

        supabaseService.updateServiceRequest(id, "status", "COMPLETION_PENDING");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Job " + id + " marked complete by worker. Awaiting consumer payment & confirmation.");
        response.put("status", "COMPLETION_PENDING");
        response.put("completionNotes", body.getNotes());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/worker/earnings")
    public ResponseEntity<Map<String, Object>> getWorkerEarnings() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("totalEarnings", 1550);
        response.put("completedJobsCount", 4);
        response.put("cooperativeAccountStatus", "VERIFIED");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/worker/welfare")
    public ResponseEntity<Map<String, Object>> getWorkerWelfare() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("insuranceStatus", "ACTIVE");
        response.put("policyNumber", "POL-COOP-2026-99");
        response.put("coverageAmount", 200000);
        response.put("welfareFundBalance", 15000);

        return ResponseEntity.ok(response);
    }
}
