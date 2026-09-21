package com.ecommerce.payment_service.event;

import java.util.UUID;

public class InventoryReservedEvent {

    private UUID orderId;
    private UUID userId;
    private Double amount;
    private String paymentMethod;
    private String productId;
    private Integer quantity;

    public InventoryReservedEvent() {
    }

    public InventoryReservedEvent(
            UUID orderId,
            UUID userId,
            Double amount,
            String paymentMethod,
            String productId,
            Integer quantity
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.productId = productId;
        this.quantity = quantity;
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

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}