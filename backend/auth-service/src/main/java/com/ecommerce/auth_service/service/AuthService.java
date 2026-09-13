package com.ecommerce.auth_service.service;

import com.ecommerce.auth_service.dto.LoginRequest;
import com.ecommerce.auth_service.dto.LoginResponse;
import com.ecommerce.auth_service.dto.RegisterRequest;
import com.ecommerce.auth_service.entity.User;
import com.ecommerce.auth_service.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setEmail(request.getEmail());

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setFullName(request.getFullName());

        user.setRole("CUSTOMER");

        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String accessToken =
                jwtService.generateToken(
                        user.getUserId(),
                        user.getEmail(),
                        user.getRole()
                );

        return new LoginResponse(
                accessToken,
                "Bearer",
                user.getUserId().toString(),
                user.getEmail(),
                user.getRole()
        );
    }

    // =========================
    // EXTRACT TOKEN
    // =========================

    public String extractToken(
            String authorizationHeader) {

        return jwtService.extractToken(
                authorizationHeader
        );
    }

    // =========================
    // EXTRACT USER ID
    // =========================

    public UUID extractUserId(String token) {

        return jwtService.extractUserId(token);
    }

    // =========================
    // GET USER BY ID
    // =========================

    public User getUserById(UUID userId) {

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
}