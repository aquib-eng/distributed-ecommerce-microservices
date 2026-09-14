package com.ecommerce.api_gateway.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET =
            "my-super-secret-key-for-ecommerce-jwt-authentication-2026";

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    /*
     * Validate JWT.
     */
    public boolean isTokenValid(String token) {

        try {

            Jws<Claims> claims =
                    Jwts.parser()
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

    /*
     * Extract Bearer token from Authorization header.
     */
    public String extractToken(String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            return null;
        }

        return authorizationHeader.substring(7);
    }

    /*
     * Extract user ID from JWT subject.
     *
     * The Auth Service stores the user's UUID
     * as the JWT subject.
     */
    public String extractUserId(String token) {

        try {

            Jws<Claims> claims =
                    Jwts.parser()
                            .verifyWith(secretKey)
                            .build()
                            .parseSignedClaims(token);

            return claims.getPayload().getSubject();

        } catch (JwtException | IllegalArgumentException e) {

            return null;
        }
    }
}