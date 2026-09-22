package com.ecommerce.notification_service.controller;

import com.ecommerce.notification_service.model.Notification;
import com.ecommerce.notification_service.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    // ======================================================
    // GET USER NOTIFICATIONS
    // GET /api/notifications
    // ======================================================

    @GetMapping
    public ResponseEntity<List<Notification>>
            getUserNotifications(
                    @RequestHeader("X-User-Id")
                    String userId
            ) {

        UUID userUuid = parseUserId(userId);

        return ResponseEntity.ok(
                notificationService
                        .getUserNotifications(userUuid)
        );
    }

    // ======================================================
    // MARK NOTIFICATION AS READ
    // PUT /api/notifications/{notificationId}/read
    // ======================================================

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification>
            markAsRead(
                    @PathVariable UUID notificationId,
                    @RequestHeader("X-User-Id")
                    String userId
            ) {

        // Validate that the header contains a valid UUID.
        parseUserId(userId);

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(notificationId)
        );
    }

    // ======================================================
    // USER ID PARSER
    // ======================================================

    private UUID parseUserId(String userId) {

        try {

            return UUID.fromString(userId);

        } catch (IllegalArgumentException exception) {

            throw new IllegalArgumentException(
                    "Invalid user ID"
            );
        }
    }
}