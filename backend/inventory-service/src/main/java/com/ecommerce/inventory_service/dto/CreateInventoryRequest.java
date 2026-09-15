package com.ecommerce.inventory_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateInventoryRequest {

    @NotBlank(message = "Product ID is required")
    private String productId;

    @NotNull(message = "Available quantity is required")
    @Min(value = 0, message = "Available quantity cannot be negative")
    private Integer availableQuantity;

    public CreateInventoryRequest() {
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }
}