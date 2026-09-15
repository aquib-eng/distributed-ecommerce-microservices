package com.ecommerce.payment_service.repository;

import com.ecommerce.payment_service.model.Payment;
import com.ecommerce.payment_service.model.PaymentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(UUID orderId);

    List<Payment> findByUserId(UUID userId);

    List<Payment> findByStatus(PaymentStatus status);

    boolean existsByOrderId(UUID orderId);
}