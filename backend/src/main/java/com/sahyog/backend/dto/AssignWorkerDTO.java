package com.sahyog.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AssignWorkerDTO {
    @NotNull
    @Size(min = 1)
    private String workerId;

    public AssignWorkerDTO() {}

    public String getWorkerId() {
        return workerId;
    }

    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }
}
