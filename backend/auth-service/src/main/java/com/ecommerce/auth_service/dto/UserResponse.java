package com.ecommerce.auth_service.dto;

import com.ecommerce.auth_service.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserResponse {

    private UUID userId;
    private String email;
    private String fullName;
    private String role;
    private LocalDateTime createdAt;

    public UserResponse() {
    }

    public UserResponse(
            UUID userId,
            String email,
            String fullName,
            String role,
            LocalDateTime createdAt) {

        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}