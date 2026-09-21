package com.ecommerce.order_service.event;

import java.util.List;
import java.util.UUID;

public class OrderCancelledEvent {

    private UUID orderId;
    private UUID userId;
    private Double amount;
    private String reason;
    private List<OrderItemEvent> items;

    public OrderCancelledEvent() {
    }

    public OrderCancelledEvent(
            UUID orderId,
            UUID userId,
            Double amount,
            String reason,
            List<OrderItemEvent> items
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.reason = reason;
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public List<OrderItemEvent> getItems() {
        return items;
    }

    public void setItems(List<OrderItemEvent> items) {
        this.items = items;
    }
}