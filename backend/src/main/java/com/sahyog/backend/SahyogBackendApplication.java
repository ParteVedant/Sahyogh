package com.sahyog.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SahyogBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SahyogBackendApplication.class, args);
        System.out.println("🚀 Sahyog Backend REST API running on http://localhost:5000");
        System.out.println("🔗 Health Check: http://localhost:5000/api/v1/health");
    }
}
