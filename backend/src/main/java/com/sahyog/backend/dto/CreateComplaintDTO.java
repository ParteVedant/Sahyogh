package com.sahyog.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CreateComplaintDTO {
    @NotNull
    @Size(min = 1)
    private String requestId;

    @NotNull
    private String category; // LATE_ARRIVAL | BEHAVIOR | OVERCHARGING | QUALITY_ISSUE | OTHER

    @NotNull
    @Size(min = 5)
    private String description;

    private List<String> evidencePhotos;

    public CreateComplaintDTO() {}

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getEvidencePhotos() {
        return evidencePhotos;
    }

    public void setEvidencePhotos(List<String> evidencePhotos) {
        this.evidencePhotos = evidencePhotos;
    }
}
