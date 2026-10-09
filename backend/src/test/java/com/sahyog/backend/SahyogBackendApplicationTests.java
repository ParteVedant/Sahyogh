package com.sahyog.backend;

import com.sahyog.backend.model.CandidateScore;
import com.sahyog.backend.model.ServiceAddress;
import com.sahyog.backend.model.ServiceRequest;
import com.sahyog.backend.service.MatchingService;
import com.sahyog.backend.service.SupabaseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SahyogBackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MatchingService matchingService;

    @Test
    void testRootEndpoint() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Sahyog (सहयोग) Cooperative Gig Services Platform REST API"))
                .andExpect(jsonPath("$.status").value("online"))
                .andExpect(jsonPath("$.documentation").value("/api/v1/health"));
    }

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("healthy"))
                .andExpect(jsonPath("$.service").value("Sahyog Cooperative REST API Engine"));
    }

    @Test
    void testAuthForbidden() throws Exception {
        mockMvc.perform(post("/api/v1/requests")
                        .header("x-user-role", "WORKER")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("Forbidden: Role 'WORKER' is not authorized to perform this operation."));
    }

    @Test
    void testMatchingScoreAlgorithm() {
        ServiceRequest req = new ServiceRequest();
        req.setCategoryName("Plumbing Repairs");
        req.setAddress(new ServiceAddress("Flat 402", "Thane", "Thane", "400601"));

        List<CandidateScore> candidates = matchingService.calculateCandidateScores(req);
        assertNotNull(candidates);
        assertFalse(candidates.isEmpty());

        CandidateScore topCandidate = candidates.get(0);
        assertEquals("Suresh Kumar", topCandidate.getWorkerName());

        // Maximum score for Suresh Kumar:
        // Skill (35) + Availability (20) + Location (13) + Experience (9) + Workload (14) = 91
        assertEquals(91, topCandidate.getMatchScore());
    }
}
