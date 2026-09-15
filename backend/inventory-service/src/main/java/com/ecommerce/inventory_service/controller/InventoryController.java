package com.ecommerce.inventory_service.controller;

import com.ecommerce.inventory_service.dto.CreateInventoryRequest;
import com.ecommerce.inventory_service.dto.InventoryResponse;
import com.ecommerce.inventory_service.dto.ReserveInventoryRequest;
import com.ecommerce.inventory_service.dto.UpdateInventoryRequest;
import com.ecommerce.inventory_service.service.InventoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(
            InventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }

    // ==========================================
    // CREATE INVENTORY
    // ==========================================

    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(
            @Valid @RequestBody CreateInventoryRequest request) {

        InventoryResponse response =
                inventoryService.createInventory(
                        request.getProductId(),
                        request.getAvailableQuantity()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ==========================================
    // GET INVENTORY
    // ==========================================

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponse> getInventory(
            @PathVariable String productId) {

        InventoryResponse response =
                inventoryService.getInventoryByProductId(
                        productId
                );

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // UPDATE INVENTORY
    // ==========================================

    @PutMapping("/{productId}")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable String productId,
            @Valid @RequestBody UpdateInventoryRequest request) {

        InventoryResponse response =
                inventoryService.updateInventory(
                        productId,
                        request.getAvailableQuantity()
                );

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RESERVE STOCK
    // ==========================================

    @PostMapping("/{productId}/reserve")
    public ResponseEntity<InventoryResponse> reserveStock(
            @PathVariable String productId,
            @Valid @RequestBody ReserveInventoryRequest request) {

        InventoryResponse response =
                inventoryService.reserveStock(
                        productId,
                        request.getQuantity()
                );

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // RELEASE STOCK
    // ==========================================

    @PostMapping("/{productId}/release")
    public ResponseEntity<InventoryResponse> releaseStock(
            @PathVariable String productId,
            @Valid @RequestBody ReserveInventoryRequest request) {

        InventoryResponse response =
                inventoryService.releaseStock(
                        productId,
                        request.getQuantity()
                );

        return ResponseEntity.ok(response);
    }
}