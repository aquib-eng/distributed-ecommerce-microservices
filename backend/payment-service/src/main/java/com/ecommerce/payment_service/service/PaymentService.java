package com.ecommerce.payment_service.service;

import com.ecommerce.payment_service.dto.PaymentResponse;
import com.ecommerce.payment_service.exception.PaymentAlreadyExistsException;
import com.ecommerce.payment_service.exception.PaymentNotFoundException;
import com.ecommerce.payment_service.exception.PaymentRefundException;
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

    // ==========================================
    // PROCESS PAYMENT
    // ==========================================

    @Transactional
    public PaymentResponse processPayment(
            UUID orderId,
            UUID userId,
            Double amount,
            String paymentMethod) {

        // One payment per order
        if (paymentRepository.existsByOrderId(orderId)) {

            throw new PaymentAlreadyExistsException(
                    "Payment already exists for order: " + orderId
            );
        }

        // Generate transaction ID
        String transactionId =
                "TXN-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        /*
         * Simulated payment.
         *
         * For now every valid payment succeeds.
         */
        Payment payment = new Payment(
                orderId,
                userId,
                amount,
                PaymentStatus.SUCCESS,
                paymentMethod,
                transactionId
        );

        Payment savedPayment =
                paymentRepository.save(payment);

        return convertToResponse(savedPayment);
    }

    // ==========================================
    // GET PAYMENT BY PAYMENT ID
    // ==========================================

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(UUID paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment not found: " + paymentId
                                )
                        );

        return convertToResponse(payment);
    }

    // ==========================================
    // GET PAYMENT BY ORDER ID
    // ==========================================

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(UUID orderId) {

        Payment payment =
                paymentRepository.findByOrderId(orderId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment not found for order: "
                                                + orderId
                                )
                        );

        return convertToResponse(payment);
    }

    // ==========================================
    // GET ALL PAYMENTS BY USER
    // ==========================================

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByUserId(UUID userId) {

        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ==========================================
    // REFUND PAYMENT
    // ==========================================

    @Transactional
    public PaymentResponse refundPayment(UUID paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new PaymentNotFoundException(
                                        "Payment not found: " + paymentId
                                )
                        );

        if (payment.getStatus() != PaymentStatus.SUCCESS) {

            throw new PaymentRefundException(
                    "Only successful payments can be refunded"
            );
        }

        payment.setStatus(PaymentStatus.REFUNDED);

        payment.setUpdatedAt(
                LocalDateTime.now()
        );

        Payment updatedPayment =
                paymentRepository.save(payment);

        return convertToResponse(updatedPayment);
    }

    // ==========================================
    // ENTITY -> DTO
    // ==========================================

    private PaymentResponse convertToResponse(
            Payment payment) {

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