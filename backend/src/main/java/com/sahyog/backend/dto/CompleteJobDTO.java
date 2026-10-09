package com.sahyog.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CompleteJobDTO {
    @NotNull
    @Size(min = 5, message = "Completion notes are required")
    private String notes;

    private List<String> photos;

    public CompleteJobDTO() {}

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<String> getPhotos() {
        return photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }
}
