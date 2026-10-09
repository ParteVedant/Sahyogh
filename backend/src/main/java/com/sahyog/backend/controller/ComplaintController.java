package com.sahyog.backend.controller;

import com.sahyog.backend.dto.ApiResponse;
import com.sahyog.backend.dto.CreateComplaintDTO;
import com.sahyog.backend.dto.ResolveComplaintDTO;
import com.sahyog.backend.model.Complaint;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {

    private final List<Complaint> inMemoryComplaints = new ArrayList<>();

    public ComplaintController() {
        initSeedData();
    }

    private void initSeedData() {
        Complaint c1 = new Complaint(
                "CMP-001",
                "1042",
                "Rahul Sharma",
                "LATE_ARRIVAL",
                "Worker arrived 45 minutes past the agreed 10:00 AM slot.",
                List.of(),
                "OPEN",
                24,
                Instant.now().toString()
        );
        inMemoryComplaints.add(c1);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Complaint>> createComplaint(
            @Valid @RequestBody CreateComplaintDTO body,
            HttpServletRequest request) {

        String userName = (String) request.getAttribute("userName");
        if (userName == null || userName.isEmpty()) {
            userName = "Consumer";
        }

        String complaintId = "CMP-" + (100 + new Random().nextInt(900));

        Complaint newComplaint = new Complaint(
                complaintId,
                body.getRequestId(),
                userName,
                body.getCategory(),
                body.getDescription(),
                body.getEvidencePhotos() != null ? body.getEvidencePhotos() : List.of(),
                "OPEN",
                24,
                Instant.now().toString()
        );

        inMemoryComplaints.add(0, newComplaint);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint filed successfully. Cooperative Admin will investigate within 24 hours.", newComplaint));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getComplaintsQueue() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", inMemoryComplaints.size());
        response.put("targetSlaHours", 24);
        response.put("data", inMemoryComplaints);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Map<String, Object>> resolveComplaint(
            @PathVariable String id,
            @Valid @RequestBody ResolveComplaintDTO body) {

        Complaint complaint = inMemoryComplaints.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (complaint != null) {
            complaint.setStatus(body.getResolution());
        }

        double refundAmount = Boolean.TRUE.equals(body.getRefundApproved())
                ? (body.getRefundAmount() != null ? body.getRefundAmount() : 350.0)
                : 0.0;

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Complaint " + id + " investigated and marked as " + body.getResolution() + ".");
        response.put("refundApproved", body.getRefundApproved());
        response.put("refundAmount", refundAmount);
        response.put("adminNotes", body.getAdminNotes());

        return ResponseEntity.ok(response);
    }
}
