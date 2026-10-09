package com.sahyog.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CandidateScore {
    private String workerId;
    private String workerName;
    private String initials;
    private String skill;
    private String societyName;
    private List<String> serviceAreas;
    private double rating;
    private int jobsCompleted;
    private double distanceKm;
    private int matchScore;
    private ScoreBreakdown breakdown;
    private CriteriaChecklist criteriaChecklist;

    public CandidateScore() {}

    public String getWorkerId() {
        return workerId;
    }

    public void setWorkerId(String workerId) {
        this.workerId = workerId;
    }

    public String getWorkerName() {
        return workerName;
    }

    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
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

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public ScoreBreakdown getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(ScoreBreakdown breakdown) {
        this.breakdown = breakdown;
    }

    public CriteriaChecklist getCriteriaChecklist() {
        return criteriaChecklist;
    }

    public void setCriteriaChecklist(CriteriaChecklist criteriaChecklist) {
        this.criteriaChecklist = criteriaChecklist;
    }

    public static class ScoreBreakdown {
        private int skillCompatibility;
        private int availability;
        private int locationProximity;
        private int experience;
        private int workloadFairness;

        public ScoreBreakdown() {}

        public ScoreBreakdown(int skillCompatibility, int availability, int locationProximity, int experience, int workloadFairness) {
            this.skillCompatibility = skillCompatibility;
            this.availability = availability;
            this.locationProximity = locationProximity;
            this.experience = experience;
            this.workloadFairness = workloadFairness;
        }

        public int getSkillCompatibility() {
            return skillCompatibility;
        }

        public void setSkillCompatibility(int skillCompatibility) {
            this.skillCompatibility = skillCompatibility;
        }

        public int getAvailability() {
            return availability;
        }

        public void setAvailability(int availability) {
            this.availability = availability;
        }

        public int getLocationProximity() {
            return locationProximity;
        }

        public void setLocationProximity(int locationProximity) {
            this.locationProximity = locationProximity;
        }

        public int getExperience() {
            return experience;
        }

        public void setExperience(int experience) {
            this.experience = experience;
        }

        public int getWorkloadFairness() {
            return workloadFairness;
        }

        public void setWorkloadFairness(int workloadFairness) {
            this.workloadFairness = workloadFairness;
        }
    }

    public static class CriteriaChecklist {
        private boolean skillMatch;
        private boolean slotAvailable;
        private boolean areaCovered;
        private boolean experienceSufficient;
        private boolean workloadBalanced;

        public CriteriaChecklist() {}

        public CriteriaChecklist(boolean skillMatch, boolean slotAvailable, boolean areaCovered, boolean experienceSufficient, boolean workloadBalanced) {
            this.skillMatch = skillMatch;
            this.slotAvailable = slotAvailable;
            this.areaCovered = areaCovered;
            this.experienceSufficient = experienceSufficient;
            this.workloadBalanced = workloadBalanced;
        }

        public boolean isSkillMatch() {
            return skillMatch;
        }

        public void setSkillMatch(boolean skillMatch) {
            this.skillMatch = skillMatch;
        }

        public boolean isSlotAvailable() {
            return slotAvailable;
        }

        public void setSlotAvailable(boolean slotAvailable) {
            this.slotAvailable = slotAvailable;
        }

        public boolean isAreaCovered() {
            return areaCovered;
        }

        public void setAreaCovered(boolean areaCovered) {
            this.areaCovered = areaCovered;
        }

        public boolean isExperienceSufficient() {
            return experienceSufficient;
        }

        public void setExperienceSufficient(boolean experienceSufficient) {
            this.experienceSufficient = experienceSufficient;
        }

        public boolean isWorkloadBalanced() {
            return workloadBalanced;
        }

        public void setWorkloadBalanced(boolean workloadBalanced) {
            this.workloadBalanced = workloadBalanced;
        }
    }
}
