package com.sahyog.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ResolveComplaintDTO {
    @NotNull
    private String resolution; // RESOLVED | REJECTED

    @NotNull
    private Boolean refundApproved;

    private Double refundAmount;

    @NotNull
    @Size(min = 3)
    private String adminNotes;

    public ResolveComplaintDTO() {}

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public Boolean getRefundApproved() {
        return refundApproved;
    }

    public void setRefundApproved(Boolean refundApproved) {
        this.refundApproved = refundApproved;
    }

    public Double getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(Double refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
