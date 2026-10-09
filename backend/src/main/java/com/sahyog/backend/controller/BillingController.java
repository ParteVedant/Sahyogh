package com.sahyog.backend.controller;

import com.sahyog.backend.dto.ApiResponse;
import com.sahyog.backend.dto.RatingDTO;
import com.sahyog.backend.service.SupabaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class BillingController {

    private final SupabaseService supabaseService;

    @Autowired
    public BillingController(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<Map<String, Object>> getInvoiceByRequestId(@PathVariable String id) {
        double baseFare = 350;
        double fee = 50;
        double tax = Math.round((baseFare + fee) * 0.18);
        double total = baseFare + fee + tax;

        String timestampStr = String.valueOf(System.currentTimeMillis());
        String invoiceNumber = "INV-" + id + "-" + timestampStr.substring(timestampStr.length() - 4);

        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("baseFare", baseFare);
        breakdown.put("serviceFee", fee);
        breakdown.put("gst18Percent", tax);
        breakdown.put("totalPayable", total);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("invoiceNumber", invoiceNumber);
        response.put("requestId", id);
        response.put("issuedTo", "Rahul Sharma");
        response.put("cooperativeIssuer", "Sahyog Labour Cooperative Federation");
        response.put("date", Instant.now().toString());
        response.put("breakdown", breakdown);
        response.put("paymentStatus", "PAID");
        response.put("paymentMethod", "UPI / Razorpay Sandbox");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitWorkerRating(@Valid @RequestBody RatingDTO body) {
        supabaseService.updateServiceRequest(body.getRequestId(), "status", "COMPLETED");

        Map<String, Object> data = new HashMap<>();
        data.put("requestId", body.getRequestId());
        data.put("stars", body.getStars());
        data.put("review", body.getReview() != null ? body.getReview() : "");
        data.put("issues", body.getIssues() != null ? body.getIssues() : List.of());

        String message = "Rating of " + body.getStars() + " stars submitted for request " + body.getRequestId() + ".";

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(message, data));
    }
}
