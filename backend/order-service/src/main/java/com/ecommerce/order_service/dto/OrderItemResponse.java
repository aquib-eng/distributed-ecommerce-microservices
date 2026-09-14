package com.ecommerce.order_service.dto;

import java.util.UUID;

public class OrderItemResponse {

    private UUID orderItemId;
    private String productId;
    private Integer quantity;
    private Double price;

    public OrderItemResponse() {
    }

    public OrderItemResponse(
            UUID orderItemId,
            String productId,
            Integer quantity,
            Double price
    ) {
        this.orderItemId = orderItemId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    public UUID getOrderItemId() {
        return orderItemId;
    }

    public String getProductId() {
        return productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getPrice() {
        return price;
    }
}
