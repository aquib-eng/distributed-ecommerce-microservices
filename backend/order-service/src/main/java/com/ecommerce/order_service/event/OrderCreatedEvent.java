package com.ecommerce.order_service.event;

import java.util.UUID;

public class OrderCreatedEvent {

    private UUID orderId;
    private UUID userId;
    private Double totalAmount;

    public OrderCreatedEvent() {
    }

    public OrderCreatedEvent(
            UUID orderId,
            UUID userId,
            Double totalAmount
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.totalAmount = totalAmount;
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

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}