package com.sahyog.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RejectJobDTO {
    @NotNull
    @Size(min = 3, message = "Rejection reason is required")
    private String reason;

    public RejectJobDTO() {}

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
