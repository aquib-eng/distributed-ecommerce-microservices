package com.ecommerce.payment_service.dto;

import com.ecommerce.payment_service.model.PaymentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class PaymentResponse {

    private UUID paymentId;
    private UUID orderId;
    private UUID userId;
    private Double amount;
    private PaymentStatus status;
    private String paymentMethod;
    private String transactionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentResponse(
            UUID paymentId,
            UUID orderId,
            UUID userId,
            Double amount,
            PaymentStatus status,
            String paymentMethod,
            String transactionId,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.paymentId = paymentId;
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getPaymentId() {
        return paymentId;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public UUID getUserId() {
        return userId;
    }

    public Double getAmount() {
        return amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}