package com.ecommerce.auth_service.dto;

public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private String userId;
    private String email;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(
            String accessToken,
            String tokenType,
            String userId,
            String email,
            String role) {

        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
