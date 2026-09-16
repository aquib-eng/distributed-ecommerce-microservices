package com.ecommerce.auth_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

    // Development secret
    // Later move this to environment/config-server.
    private static final String SECRET =
            "my-super-secret-key-for-ecommerce-jwt-authentication-2026";

    // 15 minutes
    private static final long EXPIRATION_TIME =
            15 * 60 * 1000L;

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            UUID userId,
            String email,
            String role) {

        Date now = new Date();

        Date expiration =
                new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean isTokenValid(String token) {

        try {

            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            Date expiration =
                    claims.getPayload().getExpiration();

            return expiration != null
                    && expiration.after(new Date());

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }

    // ==========================================
    // EXTRACT TOKEN
    // ==========================================

    public String extractToken(String authorizationHeader) {

        if (authorizationHeader == null) {
            return null;
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        String token =
                authorizationHeader.substring(7).trim();

        if (token.isEmpty()) {
            return null;
        }

        return token;
    }

    // ==========================================
    // EXTRACT USER ID
    // ==========================================

    public UUID extractUserId(String token) {

        Jws<Claims> claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);

        String subject =
                claims.getPayload().getSubject();

        if (subject == null || subject.isBlank()) {
            throw new JwtException("User ID missing from token");
        }

        return UUID.fromString(subject);
    }
}