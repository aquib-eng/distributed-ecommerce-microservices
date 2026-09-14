package com.ecommerce.cart_service.dto;

import java.time.LocalDateTime;

public class CartItemResponse {

    private String productId;
    private Integer quantity;
    private Double price;
    private LocalDateTime addedAt;

    public CartItemResponse() {
    }

    public CartItemResponse(
            String productId,
            Integer quantity,
            Double price,
            LocalDateTime addedAt) {

        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.addedAt = addedAt;
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

    public LocalDateTime getAddedAt() {
        return addedAt;
    }
}