package com.sahyog.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String url;

    @Value("${supabase.anon-key}")
    private String anonKey;

    public String getUrl() {
        return url;
    }

    public String getAnonKey() {
        return anonKey;
    }
}
