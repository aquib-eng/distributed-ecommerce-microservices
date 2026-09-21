package com.ecommerce.payment_service.event;

import java.util.UUID;

public class PaymentProcessEvent {

    private UUID orderId;
    private UUID userId;
    private Double amount;
    private String paymentMethod;

    public PaymentProcessEvent() {
    }

    public PaymentProcessEvent(
            UUID orderId,
            UUID userId,
            Double amount,
            String paymentMethod
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    public UUID getOrderId() {
        return orderId;
    }

    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
