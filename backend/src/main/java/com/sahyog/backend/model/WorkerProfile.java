package com.sahyog.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class WorkerProfile {
    private String id;
    private String workerCode;
    private String name;
    private String phone;
    private List<String> skills;
    private double rating;
    private int jobsCompleted;
    private String societyName;
    private List<String> serviceAreas;
    private String status; // AVAILABLE | BUSY | OFFLINE
    private boolean availableNow;
    private Integer yearsOfExperience;

    public WorkerProfile() {}

    public WorkerProfile(String id, String workerCode, String name, String phone, List<String> skills,
                         double rating, int jobsCompleted, String societyName, List<String> serviceAreas,
                         String status, boolean availableNow, Integer yearsOfExperience) {
        this.id = id;
        this.workerCode = workerCode;
        this.name = name;
        this.phone = phone;
        this.skills = skills;
        this.rating = rating;
        this.jobsCompleted = jobsCompleted;
        this.societyName = societyName;
        this.serviceAreas = serviceAreas;
        this.status = status;
        this.availableNow = availableNow;
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getWorkerCode() {
        return workerCode;
    }

    public void setWorkerCode(String workerCode) {
        this.workerCode = workerCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getJobsCompleted() {
        return jobsCompleted;
    }

    public void setJobsCompleted(int jobsCompleted) {
        this.jobsCompleted = jobsCompleted;
    }

    public String getSocietyName() {
        return societyName;
    }

    public void setSocietyName(String societyName) {
        this.societyName = societyName;
    }

    public List<String> getServiceAreas() {
        return serviceAreas;
    }

    public void setServiceAreas(List<String> serviceAreas) {
        this.serviceAreas = serviceAreas;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isAvailableNow() {
        return availableNow;
    }

    public void setAvailableNow(boolean availableNow) {
        this.availableNow = availableNow;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}
