package com.ecommerce.cart_service.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CartResponse {

    private String cartId;
    private String userId;
    private LocalDateTime createdAt;
    private List<CartItemResponse> items;

    public CartResponse() {
    }

    public CartResponse(
            String cartId,
            String userId,
            LocalDateTime createdAt,
            List<CartItemResponse> items) {

        this.cartId = cartId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.items = items;
    }

    public String getCartId() {
        return cartId;
    }

    public String getUserId() {
        return userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }
}