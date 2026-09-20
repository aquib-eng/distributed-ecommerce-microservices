package com.ecommerce.inventory_service.event;

public class OrderItemEvent {

    private String productId;
    private Integer quantity;

    public OrderItemEvent() {
    }

    public OrderItemEvent(
            String productId,
            Integer quantity
    ) {
        this.productId = productId;
        this.quantity = quantity;
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
