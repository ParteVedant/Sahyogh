package com.sahyog.backend.service;

import com.sahyog.backend.model.CandidateScore;
import com.sahyog.backend.model.ServiceRequest;
import com.sahyog.backend.model.WorkerProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final SupabaseService supabaseService;

    private static final List<WorkerProfile> FALLBACK_WORKERS = List.of(
            new WorkerProfile("worker-1", "W-042", "Suresh Kumar", "+91 98201 12345",
                    List.of("Plumbing", "Pipe Repair"), 4.6, 142,
                    "Shivaji Labour Cooperative Society", List.of("Thane", "Kalwa", "Majiwada"),
                    "AVAILABLE", true, 6),
            new WorkerProfile("worker-2", "W-041", "Amit Sharma", "+91 98200 11223",
                    List.of("Plumbing", "Sanitation"), 4.8, 18,
                    "Shivaji Labour Cooperative Society", List.of("Thane", "Borivali East", "Kandivali West"),
                    "AVAILABLE", true, 4),
            new WorkerProfile("worker-3", "W-043", "Ramesh Patil", "+91 98202 33445",
                    List.of("Electrical", "Wiring"), 4.7, 12,
                    "Dharavi Skilled Workers Federation", List.of("Kalwa", "Thane West"),
                    "BUSY", false, 5),
            new WorkerProfile("worker-4", "W-044", "Vijay Kumar", "+91 98203 44556",
                    List.of("Painting", "Coatings"), 4.5, 6,
                    "Shivaji Labour Cooperative Society", List.of("Panch Pakhadi", "Thane"),
                    "AVAILABLE", true, 3)
    );

    @Autowired
    public MatchingService(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    public List<CandidateScore> calculateCandidateScores(ServiceRequest request) {
        List<WorkerProfile> workers = supabaseService.fetchWorkersFromSupabase();
        if (workers.isEmpty()) {
            workers = FALLBACK_WORKERS;
        }

        String categoryNameLower = request.getCategoryName().toLowerCase();
        String requestLocalityLower = (request.getAddress() != null && request.getAddress().getLocality() != null)
                ? request.getAddress().getLocality().toLowerCase()
                : "";

        List<CandidateScore> candidateScores = new ArrayList<>();

        for (WorkerProfile worker : workers) {
            List<String> skills = worker.getSkills() != null ? worker.getSkills() : List.of();
            boolean hasExactSkill = skills.stream().anyMatch(s ->
                    s.toLowerCase().contains(categoryNameLower) || categoryNameLower.contains(s.toLowerCase())
            );
            int skillScore = hasExactSkill ? 35 : 15;

            boolean isAvailableNow = worker.isAvailableNow() && "AVAILABLE".equalsIgnoreCase(worker.getStatus());
            int availabilityScore = isAvailableNow ? 20 : 5;

            List<String> serviceAreas = worker.getServiceAreas() != null ? worker.getServiceAreas() : List.of();
            boolean coversLocality = serviceAreas.stream().anyMatch(area ->
                    requestLocalityLower.contains(area.toLowerCase()) || area.toLowerCase().contains(requestLocalityLower)
            );
            int locationScore = coversLocality ? 13 : 8;

            int expYears = worker.getYearsOfExperience() != null ? worker.getYearsOfExperience() : 4;
            int experienceScore = Math.min(10, (int) Math.round(expYears * 1.5));

            int workloadScore;
            if (worker.getJobsCompleted() > 50) {
                workloadScore = 14;
            } else if (worker.getJobsCompleted() > 20) {
                workloadScore = 17;
            } else {
                workloadScore = 20;
            }

            int totalScore = skillScore + availabilityScore + locationScore + experienceScore + workloadScore;

            String initials = Arrays.stream(worker.getName().split(" "))
                    .filter(part -> !part.isEmpty())
                    .map(part -> String.valueOf(part.charAt(0)))
                    .collect(Collectors.joining())
                    .toUpperCase();

            CandidateScore candidate = new CandidateScore();
            candidate.setWorkerId(worker.getId());
            candidate.setWorkerName(worker.getName());
            candidate.setInitials(initials);
            candidate.setSkill(!skills.isEmpty() ? skills.get(0) : request.getCategoryName());
            candidate.setSocietyName(worker.getSocietyName());
            candidate.setServiceAreas(serviceAreas);
            candidate.setRating(worker.getRating());
            candidate.setJobsCompleted(worker.getJobsCompleted());
            candidate.setDistanceKm(coversLocality ? 1.5 : 3.8);
            candidate.setMatchScore(totalScore);

            candidate.setBreakdown(new CandidateScore.ScoreBreakdown(
                    skillScore, availabilityScore, locationScore, experienceScore, workloadScore
            ));

            candidate.setCriteriaChecklist(new CandidateScore.CriteriaChecklist(
                    hasExactSkill, isAvailableNow, coversLocality, expYears >= 2, workloadScore >= 14
            ));

            candidateScores.add(candidate);
        }

        candidateScores.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));
        return candidateScores;
    }
}
