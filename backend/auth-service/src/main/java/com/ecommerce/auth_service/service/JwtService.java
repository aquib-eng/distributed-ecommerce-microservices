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

    // Development secret.
    // Later we will move this to environment/config-server.
    private static final String SECRET =
            "my-super-secret-key-for-ecommerce-jwt-authentication-2026";

    // Access token validity: 15 minutes
    private static final long EXPIRATION_TIME =
            15 * 60 * 1000;

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    // Generate JWT token
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

    // Validate JWT token
    public boolean isTokenValid(String token) {

        try {

            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            return claims.getPayload()
                    .getExpiration()
                    .after(new Date());

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }

    // Extract Bearer token from Authorization header
    public String extractToken(String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            return null;
        }

        return authorizationHeader.substring(7);
    }

    // Extract user ID from JWT subject
    public UUID extractUserId(String token) {

        Jws<Claims> claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);

        return UUID.fromString(
                claims.getPayload().getSubject()
        );
    }
}