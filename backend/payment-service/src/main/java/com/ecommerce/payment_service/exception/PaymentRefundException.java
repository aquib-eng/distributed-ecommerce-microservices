package com.ecommerce.payment_service.exception;

public class PaymentRefundException extends RuntimeException {

    public PaymentRefundException(String message) {
        super(message);
    }
}