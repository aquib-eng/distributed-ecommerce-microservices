package com.ecommerce.payment_service.listener;

import com.ecommerce.payment_service.dto.PaymentResponse;
import com.ecommerce.payment_service.event.InventoryReservedEvent;
import com.ecommerce.payment_service.event.PaymentFailedEvent;
import com.ecommerce.payment_service.event.PaymentSuccessfulEvent;
import com.ecommerce.payment_service.service.PaymentService;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class InventoryReservedListener {

    private final PaymentService paymentService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public InventoryReservedListener(
            PaymentService paymentService,
            KafkaTemplate<String, Object> kafkaTemplate
    ) {
        this.paymentService = paymentService;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(
            topics = "inventory-reserved",
            groupId = "payment-service"
    )
    public void handleInventoryReserved(
            InventoryReservedEvent event
    ) {

        System.out.println(
                "Received InventoryReservedEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", amount=" + event.getAmount() +
                ", paymentMethod=" + event.getPaymentMethod() +
                ", productId=" + event.getProductId() +
                ", quantity=" + event.getQuantity()
        );

        try {

            // ==========================================
            // PROCESS PAYMENT
            // ==========================================

            PaymentResponse paymentResponse =
                    paymentService.processPayment(
                            event.getOrderId(),
                            event.getUserId(),
                            event.getAmount(),
                            event.getPaymentMethod()
                    );

            System.out.println(
                    "Payment processed successfully: " +
                    "paymentId=" + paymentResponse.getPaymentId() +
                    ", orderId=" + paymentResponse.getOrderId() +
                    ", status=" + paymentResponse.getStatus() +
                    ", transactionId=" +
                    paymentResponse.getTransactionId()
            );

            // ==========================================
            // CREATE PAYMENT SUCCESS EVENT
            // ==========================================

            PaymentSuccessfulEvent successfulEvent =
                    new PaymentSuccessfulEvent(
                            paymentResponse.getPaymentId(),
                            paymentResponse.getOrderId(),
                            paymentResponse.getUserId(),
                            paymentResponse.getAmount(),
                            paymentResponse.getPaymentMethod(),
                            paymentResponse.getTransactionId()
                    );

            // ==========================================
            // PUBLISH PAYMENT SUCCESS EVENT
            // ==========================================

            kafkaTemplate.send(
                    "payment-successful",
                    successfulEvent
            );

            System.out.println(
                    "Published PaymentSuccessfulEvent: " +
                    "paymentId=" +
                    paymentResponse.getPaymentId() +
                    ", orderId=" +
                    paymentResponse.getOrderId() +
                    ", transactionId=" +
                    paymentResponse.getTransactionId()
            );

        } catch (Exception exception) {

            // ==========================================
            // PAYMENT FAILED
            // ==========================================

            System.out.println(
                    "Payment failed: " +
                    exception.getMessage()
            );

            PaymentFailedEvent failedEvent =
                    new PaymentFailedEvent(
                            event.getOrderId(),
                            event.getUserId(),
                            event.getAmount(),
                            event.getPaymentMethod(),
                            exception.getMessage()
                    );

            // ==========================================
            // PUBLISH PAYMENT FAILED EVENT
            // ==========================================

            kafkaTemplate.send(
                    "payment-failed",
                    failedEvent
            );

            System.out.println(
                    "Published PaymentFailedEvent: " +
                    "orderId=" +
                    event.getOrderId() +
                    ", reason=" +
                    exception.getMessage()
            );
        }
    }
}