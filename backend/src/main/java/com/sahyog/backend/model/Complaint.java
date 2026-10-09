package com.sahyog.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Complaint {
    private String id;
    private String requestId;
    private String consumerName;
    private String category;
    private String description;
    private List<String> evidencePhotos;
    private String status;
    private int targetSlaHours;
    private String createdAt;

    public Complaint() {}

    public Complaint(String id, String requestId, String consumerName, String category, String description,
                     List<String> evidencePhotos, String status, int targetSlaHours, String createdAt) {
        this.id = id;
        this.requestId = requestId;
        this.consumerName = consumerName;
        this.category = category;
        this.description = description;
        this.evidencePhotos = evidencePhotos;
        this.status = status;
        this.targetSlaHours = targetSlaHours;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getConsumerName() {
        return consumerName;
    }

    public void setConsumerName(String consumerName) {
        this.consumerName = consumerName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getTargetSlaHours() {
        return targetSlaHours;
    }

    public void setTargetSlaHours(int targetSlaHours) {
        this.targetSlaHours = targetSlaHours;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
