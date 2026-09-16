package com.ecommerce.inventory_service.service;

import com.ecommerce.inventory_service.dto.InventoryResponse;
import com.ecommerce.inventory_service.exception.InventoryAlreadyExistsException;
import com.ecommerce.inventory_service.exception.InventoryNotFoundException;
import com.ecommerce.inventory_service.model.Inventory;
import com.ecommerce.inventory_service.repository.InventoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // ==========================================
    // CREATE INVENTORY
    // ==========================================

    @Transactional
    public InventoryResponse createInventory(
            String productId,
            Integer availableQuantity) {

        if (inventoryRepository.existsByProductId(productId)) {

            throw new InventoryAlreadyExistsException(
                    "Inventory already exists for product: " + productId
            );
        }

        Inventory inventory =
                new Inventory(productId, availableQuantity);

        Inventory savedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(savedInventory);
    }

    // ==========================================
    // GET INVENTORY
    // ==========================================

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryByProductId(
            String productId) {

        Inventory inventory =
                inventoryRepository
                        .findByProductId(productId)
                        .orElseThrow(() ->
                                new InventoryNotFoundException(
                                        "Inventory not found for product: "
                                                + productId
                                )
                        );

        return convertToResponse(inventory);
    }

    // ==========================================
    // UPDATE INVENTORY
    // ==========================================

    @Transactional
    public InventoryResponse updateInventory(
            String productId,
            Integer availableQuantity) {

        Inventory inventory =
                inventoryRepository
                        .findByProductId(productId)
                        .orElseThrow(() ->
                                new InventoryNotFoundException(
                                        "Inventory not found for product: "
                                                + productId
                                )
                        );

        inventory.setAvailableQuantity(availableQuantity);

        inventory.setUpdatedAt(
                java.time.LocalDateTime.now()
        );

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    // ==========================================
    // RESERVE STOCK
    // ==========================================

    @Transactional
    public InventoryResponse reserveStock(
            String productId,
            Integer quantity) {

        Inventory inventory =
                inventoryRepository
                        .findByProductId(productId)
                        .orElseThrow(() ->
                                new InventoryNotFoundException(
                                        "Inventory not found for product: "
                                                + productId
                                )
                        );

        if (inventory.getAvailableQuantity() < quantity) {

            throw new IllegalArgumentException(
                    "Insufficient stock"
            );
        }

        inventory.setAvailableQuantity(
                inventory.getAvailableQuantity() - quantity
        );

        inventory.setReservedQuantity(
                inventory.getReservedQuantity() + quantity
        );

        inventory.setUpdatedAt(
                java.time.LocalDateTime.now()
        );

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    // ==========================================
    // RELEASE STOCK
    // ==========================================

    @Transactional
    public InventoryResponse releaseStock(
            String productId,
            Integer quantity) {

        Inventory inventory =
                inventoryRepository
                        .findByProductId(productId)
                        .orElseThrow(() ->
                                new InventoryNotFoundException(
                                        "Inventory not found for product: "
                                                + productId
                                )
                        );

        if (inventory.getReservedQuantity() < quantity) {

            throw new IllegalArgumentException(
                    "Cannot release more than reserved quantity"
            );
        }

        inventory.setReservedQuantity(
                inventory.getReservedQuantity() - quantity
        );

        inventory.setAvailableQuantity(
                inventory.getAvailableQuantity() + quantity
        );

        inventory.setUpdatedAt(
                java.time.LocalDateTime.now()
        );

        Inventory updatedInventory =
                inventoryRepository.save(inventory);

        return convertToResponse(updatedInventory);
    }

    // ==========================================
    // CONVERT ENTITY -> DTO
    // ==========================================

    private InventoryResponse convertToResponse(
            Inventory inventory) {

        return new InventoryResponse(
                inventory.getInventoryId(),
                inventory.getProductId(),
                inventory.getAvailableQuantity(),
                inventory.getReservedQuantity(),
                inventory.getCreatedAt(),
                inventory.getUpdatedAt()
        );
    }
}