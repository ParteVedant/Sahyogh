package com.sahyog.backend.service;

import com.sahyog.backend.config.SupabaseConfig;
import com.sahyog.backend.model.WorkerProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupabaseService {

    private final SupabaseConfig config;

    @Autowired
    public SupabaseService(SupabaseConfig config) {
        this.config = config;
    }

    public List<WorkerProfile> fetchWorkersFromSupabase() {
        // In the original Node codebase, supabase fetch handles connection errors gracefully and falls back.
        // We attempt or return empty to trigger fallback logic in MatchingService.
        try {
            // Placeholder for optional RestTemplate call to config.getUrl() + "/rest/v1/workers"
            return new ArrayList<>();
        } catch (Exception err) {
            System.err.println("Supabase fetch warning for workers: " + err.getMessage());
            return new ArrayList<>();
        }
    }

    public void updateServiceRequest(String id, String field, Object value) {
        try {
            // Supabase update warning caught silently
        } catch (Exception dbErr) {
            System.err.println("Supabase update warning: " + dbErr.getMessage());
        }
    }

    public void insertServiceRequest(Object record) {
        try {
            // Supabase insert warning caught silently
        } catch (Exception dbErr) {
            System.err.println("Supabase insert warning: " + dbErr.getMessage());
        }
    }
}
