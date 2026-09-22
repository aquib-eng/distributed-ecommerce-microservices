package com.ecommerce.notification_service.listener;

import com.ecommerce.notification_service.event.OrderCancelledEvent;
import com.ecommerce.notification_service.event.OrderCreatedEvent;
import com.ecommerce.notification_service.event.PaymentFailedEvent;
import com.ecommerce.notification_service.event.PaymentSuccessfulEvent;
import com.ecommerce.notification_service.service.NotificationService;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    private final NotificationService notificationService;

    public NotificationEventListener(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    // ======================================================
    // ORDER CREATED
    // ======================================================

    @KafkaListener(
            topics = "order-created",
            containerFactory = "orderCreatedKafkaListenerContainerFactory"
    )
    public void handleOrderCreated(
            OrderCreatedEvent event
    ) {

        System.out.println(
                "Received OrderCreatedEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", totalAmount=" + event.getTotalAmount()
        );

        String message =
                "Your order " +
                event.getOrderId() +
                " has been created successfully.";

        notificationService.createNotification(
                event.getUserId(),
                event.getOrderId(),
                "ORDER_CREATED",
                message
        );

        System.out.println(
                "Order created notification saved."
        );
    }

    // ======================================================
    // PAYMENT SUCCESSFUL
    // ======================================================

    @KafkaListener(
            topics = "payment-successful",
            containerFactory = "paymentSuccessfulKafkaListenerContainerFactory"
    )
    public void handlePaymentSuccessful(
            PaymentSuccessfulEvent event
    ) {

        System.out.println(
                "Received PaymentSuccessfulEvent: " +
                "paymentId=" + event.getPaymentId() +
                ", orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", amount=" + event.getAmount()
        );

        String message =
                "Payment successful for order " +
                event.getOrderId() +
                ". Transaction ID: " +
                event.getTransactionId();

        notificationService.createNotification(
                event.getUserId(),
                event.getOrderId(),
                "PAYMENT_SUCCESSFUL",
                message
        );

        System.out.println(
                "Payment successful notification saved."
        );
    }

    // ======================================================
    // PAYMENT FAILED
    // ======================================================

    @KafkaListener(
            topics = "payment-failed",
            containerFactory = "paymentFailedKafkaListenerContainerFactory"
    )
    public void handlePaymentFailed(
            PaymentFailedEvent event
    ) {

        System.out.println(
                "Received PaymentFailedEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", amount=" + event.getAmount() +
                ", reason=" + event.getReason()
        );

        String message =
                "Payment failed for order " +
                event.getOrderId() +
                ". Reason: " +
                event.getReason();

        notificationService.createNotification(
                event.getUserId(),
                event.getOrderId(),
                "PAYMENT_FAILED",
                message
        );

        System.out.println(
                "Payment failed notification saved."
        );
    }

    // ======================================================
    // ORDER CANCELLED
    // ======================================================

    @KafkaListener(
            topics = "order-cancelled",
            containerFactory = "orderCancelledKafkaListenerContainerFactory"
    )
    public void handleOrderCancelled(
            OrderCancelledEvent event
    ) {

        System.out.println(
                "Received OrderCancelledEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", amount=" + event.getAmount() +
                ", reason=" + event.getReason()
        );

        String message =
                "Your order " +
                event.getOrderId() +
                " has been cancelled. Reason: " +
                event.getReason();

        notificationService.createNotification(
                event.getUserId(),
                event.getOrderId(),
                "ORDER_CANCELLED",
                message
        );

        System.out.println(
                "Order cancellation notification saved."
        );
    }
}