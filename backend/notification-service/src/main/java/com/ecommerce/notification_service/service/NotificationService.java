package com.ecommerce.notification_service.service;

import com.ecommerce.notification_service.model.Notification;
import com.ecommerce.notification_service.repository.NotificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(
            UUID userId,
            UUID orderId,
            String type,
            String message
    ) {

        Notification notification =
                new Notification(
                        userId,
                        orderId,
                        type,
                        message
                );

        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUserNotifications(
            UUID userId
    ) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Notification markAsRead(
            UUID notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Notification not found: "
                                                + notificationId
                                )
                        );

        notification.setStatus("READ");

        return notificationRepository.save(notification);
    }
}