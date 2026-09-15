package com.ecommerce.inventory_service.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class InventoryResponse {

    private UUID inventoryId;
    private String productId;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InventoryResponse() {
    }

    public InventoryResponse(
            UUID inventoryId,
            String productId,
            Integer availableQuantity,
            Integer reservedQuantity,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.inventoryId = inventoryId;
        this.productId = productId;
        this.availableQuantity = availableQuantity;
        this.reservedQuantity = reservedQuantity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getInventoryId() {
        return inventoryId;
    }

    public String getProductId() {
        return productId;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public Integer getReservedQuantity() {
        return reservedQuantity;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}