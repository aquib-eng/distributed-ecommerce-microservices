package com.ecommerce.inventory_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateInventoryRequest {

    @NotNull(message = "Available quantity is required")
    @Min(value = 0, message = "Available quantity cannot be negative")
    private Integer availableQuantity;

    public UpdateInventoryRequest() {
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }
}