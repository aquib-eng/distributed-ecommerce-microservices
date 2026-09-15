package com.ecommerce.payment_service.controller;

import com.ecommerce.payment_service.dto.PaymentResponse;
import com.ecommerce.payment_service.dto.ProcessPaymentRequest;
import com.ecommerce.payment_service.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Process payment
    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody ProcessPaymentRequest request) {

        PaymentResponse response =
                paymentService.processPayment(
                        request.getOrderId(),
                        request.getUserId(),
                        request.getAmount(),
                        request.getPaymentMethod()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get payment by payment ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @PathVariable UUID paymentId) {

        PaymentResponse response =
                paymentService.getPaymentById(paymentId);

        return ResponseEntity.ok(response);
    }

    // Get payment by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            @PathVariable UUID orderId) {

        PaymentResponse response =
                paymentService.getPaymentByOrderId(orderId);

        return ResponseEntity.ok(response);
    }

    // Get all payments of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByUserId(
            @PathVariable UUID userId) {

        List<PaymentResponse> responses =
                paymentService.getPaymentsByUserId(userId);

        return ResponseEntity.ok(responses);
    }

    // Refund payment
    @PutMapping("/{paymentId}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(
            @PathVariable UUID paymentId) {

        PaymentResponse response =
                paymentService.refundPayment(paymentId);

        return ResponseEntity.ok(response);
    }
}