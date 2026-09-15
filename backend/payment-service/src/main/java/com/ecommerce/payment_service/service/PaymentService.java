package com.ecommerce.payment_service.service;

import com.ecommerce.payment_service.dto.PaymentResponse;
import com.ecommerce.payment_service.model.Payment;
import com.ecommerce.payment_service.model.PaymentStatus;
import com.ecommerce.payment_service.repository.PaymentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Process a new payment
    @Transactional
    public PaymentResponse processPayment(
            UUID orderId,
            UUID userId,
            Double amount,
            String paymentMethod) {

        // One payment per order in this first version
        if (paymentRepository.existsByOrderId(orderId)) {
            throw new RuntimeException(
                    "Payment already exists for order: " + orderId);
        }

        // Generate a simple transaction ID
        String transactionId =
                "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        /*
         * This is a simulated payment.
         *
         * For now we assume the payment succeeds.
         * Later we can integrate a real payment provider.
         */
        Payment payment = new Payment(
                orderId,
                userId,
                amount,
                PaymentStatus.SUCCESS,
                paymentMethod,
                transactionId
        );

        Payment savedPayment = paymentRepository.save(payment);

        return convertToResponse(savedPayment);
    }

    // Get payment by payment ID
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(UUID paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found: " + paymentId));

        return convertToResponse(payment);
    }

    // Get payment by order ID
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(UUID orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for order: " + orderId));

        return convertToResponse(payment);
    }

    // Get all payments of a user
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByUserId(UUID userId) {

        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Refund payment
    @Transactional
    public PaymentResponse refundPayment(UUID paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found: " + paymentId));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException(
                    "Only successful payments can be refunded");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setUpdatedAt(LocalDateTime.now());

        Payment updatedPayment = paymentRepository.save(payment);

        return convertToResponse(updatedPayment);
    }

    // Convert Entity to DTO
    private PaymentResponse convertToResponse(Payment payment) {

        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getOrderId(),
                payment.getUserId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaymentMethod(),
                payment.getTransactionId(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}