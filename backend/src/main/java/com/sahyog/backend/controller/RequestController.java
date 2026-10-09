package com.sahyog.backend.controller;

import com.sahyog.backend.dto.ApiResponse;
import com.sahyog.backend.dto.CreateRequestDTO;
import com.sahyog.backend.model.AmountBreakdown;
import com.sahyog.backend.model.RequestStatus;
import com.sahyog.backend.model.ServiceAddress;
import com.sahyog.backend.model.ServiceRequest;
import com.sahyog.backend.service.SupabaseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/requests")
public class RequestController {

    private final SupabaseService supabaseService;
    private final List<ServiceRequest> inMemoryRequests = new ArrayList<>();

    @Autowired
    public RequestController(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
        initSeedData();
    }

    private void initSeedData() {
        ServiceRequest r1 = new ServiceRequest();
        r1.setId("REQ-1042");
        r1.setCategoryId("plumbing");
        r1.setCategoryName("Plumbing Repairs");
        r1.setTitle("Pipe leakage repair");
        r1.setProblemDescription("Bathroom pipe is leaking near the sink. Water is pooling on the floor — would like it looked at today if possible.");
        r1.setConsumerName("Rahul Sharma");
        r1.setConsumerPhone("+91 98199 88776");
        r1.setAddress(new ServiceAddress("Flat 402, Building A", "Thane", "Thane", "400601"));
        r1.setStatus(RequestStatus.IN_PROGRESS);
        r1.setAssignedWorkerId("worker-1");
        r1.setAssignedWorkerName("Suresh Kumar");
        r1.setPreferredDate("2026-08-28");
        r1.setPreferredTimeSlot("10:00 AM");
        r1.setAmount(new AmountBreakdown(350, 50, 72, 472));
        r1.setCreatedAt("2026-08-28T09:41:00Z");

        ServiceRequest r2 = new ServiceRequest();
        r2.setId("REQ-1043");
        r2.setCategoryId("electrical");
        r2.setCategoryName("Electrical Wiring & Appliances");
        r2.setTitle("Ceiling fan installation");
        r2.setProblemDescription("New ceiling fan needs to be mounted and wired in the living room.");
        r2.setConsumerName("Priya Verma");
        r2.setConsumerPhone("+91 98200 99887");
        r2.setAddress(new ServiceAddress("Flat 101, B Wing", "Kalwa", "Thane", "400605"));
        r2.setStatus(RequestStatus.WORKER_ASSIGNED);
        r2.setAssignedWorkerId("worker-3");
        r2.setAssignedWorkerName("Ramesh Patil");
        r2.setPreferredDate("2026-08-28");
        r2.setPreferredTimeSlot("11:00 AM");
        r2.setAmount(new AmountBreakdown(400, 50, 81, 531));
        r2.setCreatedAt("2026-08-28T09:52:00Z");

        inMemoryRequests.add(r1);
        inMemoryRequests.add(r2);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceRequest>> createServiceRequest(
            @Valid @RequestBody CreateRequestDTO body,
            HttpServletRequest request) {

        String reqId = "REQ-" + (1000 + new Random().nextInt(9000));
        double baseFare = 350;
        double fee = 50;
        double tax = Math.round((baseFare + fee) * 0.18);
        double total = baseFare + fee + tax;

        String userName = (String) request.getAttribute("userName");
        if (userName == null || userName.isEmpty()) {
            userName = "Rahul Sharma";
        }

        ServiceAddress addr = new ServiceAddress(
                body.getAddress().getHouseNo(),
                body.getAddress().getLocality(),
                body.getAddress().getCity(),
                body.getAddress().getPinCode()
        );

        ServiceRequest newReq = new ServiceRequest();
        newReq.setId(reqId);
        newReq.setCategoryId(body.getCategoryId());
        newReq.setCategoryName(body.getCategoryName());
        newReq.setTitle(body.getTitle());
        newReq.setProblemDescription(body.getProblemDescription());
        newReq.setConsumerName(body.getConsumerName() != null ? body.getConsumerName() : userName);
        newReq.setConsumerPhone(body.getConsumerPhone() != null ? body.getConsumerPhone() : "+91 98199 88776");
        newReq.setAddress(addr);
        newReq.setStatus(RequestStatus.REQUESTED);
        newReq.setPreferredDate(body.getPreferredDate());
        newReq.setPreferredTimeSlot(body.getPreferredTimeSlot());
        newReq.setEvidencePhotos(body.getEvidencePhotos() != null ? body.getEvidencePhotos() : List.of());
        newReq.setAmount(new AmountBreakdown(baseFare, fee, tax, total));
        newReq.setCreatedAt(Instant.now().toString());

        supabaseService.insertServiceRequest(newReq);
        inMemoryRequests.add(0, newReq);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service request created successfully", newReq));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceRequest>>> getServiceRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String area) {

        List<ServiceRequest> requestsList = new ArrayList<>(inMemoryRequests);

        if (status != null && !"ALL".equalsIgnoreCase(status)) {
            requestsList = requestsList.stream()
                    .filter(r -> r.getStatus() != null && r.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        if (category != null && !"ALL".equalsIgnoreCase(category)) {
            requestsList = requestsList.stream()
                    .filter(r -> r.getCategoryId() != null && r.getCategoryId().equalsIgnoreCase(category))
                    .collect(Collectors.toList());
        }

        if (area != null && !"ALL".equalsIgnoreCase(area)) {
            requestsList = requestsList.stream()
                    .filter(r -> r.getAddress() != null && r.getAddress().getLocality() != null &&
                            r.getAddress().getLocality().toLowerCase().contains(area.toLowerCase()))
                    .collect(Collectors.toList());
        }

        ApiResponse<List<ServiceRequest>> response = ApiResponse.success(requestsList);
        response.setCount(requestsList.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceRequest>> getServiceRequestById(@PathVariable String id) {
        ServiceRequest reqItem = inMemoryRequests.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElse(inMemoryRequests.isEmpty() ? null : inMemoryRequests.get(0)); // Preserved Quirk: Fallback to [0]

        return ResponseEntity.ok(ApiResponse.success(reqItem));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Object>> cancelServiceRequest(@PathVariable String id) {
        ServiceRequest reqItem = inMemoryRequests.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (reqItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Request not found"));
        }

        try {
            long createdTime = Instant.parse(reqItem.getCreatedAt()).toEpochMilli();
            long currentTime = System.currentTimeMillis();
            double hoursElapsed = (currentTime - createdTime) / (1000.0 * 60.0 * 60.0);

            if (hoursElapsed > 3.0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Cancellation period expired. Consumers may only cancel within 3 hours of creation."));
            }
        } catch (Exception e) {
            // Ignore parse errors if any
        }

        reqItem.setStatus(RequestStatus.CANCELLED);

        return ResponseEntity.ok(ApiResponse.success(
                "Service request " + id + " cancelled successfully within 3-hour window.", reqItem));
    }
}
