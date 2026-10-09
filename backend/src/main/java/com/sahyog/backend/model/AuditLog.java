package com.sahyog.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuditLog {
    private String id;
    private String action;
    private String actorName;
    private UserRole actorRole;
    private String details;
    private String timestamp;

    public AuditLog() {}

    public AuditLog(String id, String action, String actorName, UserRole actorRole, String details, String timestamp) {
        this.id = id;
        this.action = action;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.details = details;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActorName() {
        return actorName;
    }

    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    public UserRole getActorRole() {
        return actorRole;
    }

    public void setActorRole(UserRole actorRole) {
        this.actorRole = actorRole;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
