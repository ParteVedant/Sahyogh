package com.sahyog.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingDetails {
    private int stars;
    private String review;
    private List<String> issues;
    private String createdAt;

    public RatingDetails() {}

    public RatingDetails(int stars, String review, List<String> issues, String createdAt) {
        this.stars = stars;
        this.review = review;
        this.issues = issues;
        this.createdAt = createdAt;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public List<String> getIssues() {
        return issues;
    }

    public void setIssues(List<String> issues) {
        this.issues = issues;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
