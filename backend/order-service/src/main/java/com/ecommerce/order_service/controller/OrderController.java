package com.ecommerce.order_service.controller;

import com.ecommerce.order_service.dto.CreateOrderRequest;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.service.OrderService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody CreateOrderRequest request) {

        UUID userUUID = UUID.fromString(userId);

        OrderResponse response =
                orderService.createOrder(userUUID, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            @RequestHeader("X-User-Id") String userId) {

        UUID userUUID = UUID.fromString(userId);

        List<OrderResponse> orders =
                orderService.getUserOrders(userUUID);

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID orderId) {

        UUID userUUID = UUID.fromString(userId);

        OrderResponse response =
                orderService.getOrder(
                        userUUID,
                        orderId
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable UUID orderId) {

        UUID userUUID = UUID.fromString(userId);

        OrderResponse response =
                orderService.cancelOrder(
                        userUUID,
                        orderId
                );

        return ResponseEntity.ok(response);
    }
}