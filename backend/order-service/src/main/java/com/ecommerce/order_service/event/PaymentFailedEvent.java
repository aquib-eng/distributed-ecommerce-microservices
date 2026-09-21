
package com.ecommerce.order_service.event;

import java.util.UUID;

public class PaymentFailedEvent {

    private UUID orderId;
    private UUID userId;
    private Double amount;
    private String paymentMethod;
    private String reason;

    public PaymentFailedEvent() {
    }

    public PaymentFailedEvent(
            UUID orderId,
            UUID userId,
            Double amount,
            String paymentMethod,
            String reason
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.reason = reason;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}

