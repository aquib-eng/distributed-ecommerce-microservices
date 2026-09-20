package com.ecommerce.order_service.event;

import java.util.List;
import java.util.UUID;

public class OrderCreatedEvent {

    private UUID orderId;
    private UUID userId;
    private Double totalAmount;
    private List<OrderItemEvent> items;

    public OrderCreatedEvent() {
    }

    public OrderCreatedEvent(
            UUID orderId,
            UUID userId,
            Double totalAmount,
            List<OrderItemEvent> items
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.items = items;
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

    public List<OrderItemEvent> getItems() {
        return items;
    }

    public void setItems(List<OrderItemEvent> items) {
        this.items = items;
    }
}