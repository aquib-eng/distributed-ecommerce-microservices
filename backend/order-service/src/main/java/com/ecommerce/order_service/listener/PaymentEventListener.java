package com.ecommerce.order_service.listener;

import com.ecommerce.order_service.event.OrderCancelledEvent;
import com.ecommerce.order_service.event.OrderItemEvent;
import com.ecommerce.order_service.event.PaymentFailedEvent;
import com.ecommerce.order_service.event.PaymentSuccessfulEvent;
import com.ecommerce.order_service.model.Order;
import com.ecommerce.order_service.repository.OrderRepository;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class PaymentEventListener {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PaymentEventListener(
            OrderRepository orderRepository,
            KafkaTemplate<String, Object> kafkaTemplate) {

        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    // ==========================================
    // PAYMENT SUCCESSFUL
    // ==========================================

    @KafkaListener(
            topics = "payment-successful",
            groupId = "order-service",
            containerFactory =
                    "paymentSuccessfulKafkaListenerContainerFactory"
    )
    @Transactional
    public void handlePaymentSuccessful(
            PaymentSuccessfulEvent event) {

        System.out.println(
                "Received PaymentSuccessfulEvent: " +
                "paymentId=" + event.getPaymentId() +
                ", orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", amount=" + event.getAmount() +
                ", paymentMethod=" +
                event.getPaymentMethod() +
                ", transactionId=" +
                event.getTransactionId()
        );

        Order order =
                orderRepository.findById(event.getOrderId())
                        .orElse(null);

        if (order == null) {

            System.out.println(
                    "Order not found for payment success: " +
                    event.getOrderId()
            );

            return;
        }

        // Already confirmed
        if ("CONFIRMED".equals(order.getStatus())) {

            System.out.println(
                    "Order is already confirmed: " +
                    event.getOrderId()
            );

            return;
        }

        // Cancelled orders should not become confirmed
        if ("CANCELLED".equals(order.getStatus())) {

            System.out.println(
                    "Cancelled order cannot be confirmed: " +
                    event.getOrderId()
            );

            return;
        }

        order.setStatus("CONFIRMED");

        orderRepository.save(order);

        System.out.println(
                "Order confirmed successfully: " +
                event.getOrderId()
        );
    }

    // ==========================================
    // PAYMENT FAILED
    // ==========================================

    @KafkaListener(
            topics = "payment-failed",
            groupId = "order-service",
            containerFactory =
                    "paymentFailedKafkaListenerContainerFactory"
    )
    @Transactional
    public void handlePaymentFailed(
            PaymentFailedEvent event) {

        System.out.println(
                "Received PaymentFailedEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", amount=" + event.getAmount() +
                ", paymentMethod=" +
                event.getPaymentMethod() +
                ", reason=" + event.getReason()
        );

        Order order =
                orderRepository.findById(event.getOrderId())
                        .orElse(null);

        if (order == null) {

            System.out.println(
                    "Order not found for payment failure: " +
                    event.getOrderId()
            );

            return;
        }

        // Already cancelled
        if ("CANCELLED".equals(order.getStatus())) {

            System.out.println(
                    "Order is already cancelled: " +
                    event.getOrderId()
            );

            return;
        }

        // Confirmed orders should not be cancelled
        if ("CONFIRMED".equals(order.getStatus())) {

            System.out.println(
                    "Confirmed order cannot be cancelled: " +
                    event.getOrderId()
            );

            return;
        }

        // ==========================================
        // CANCEL ORDER
        // ==========================================

        order.setStatus("CANCELLED");

        orderRepository.save(order);

        System.out.println(
                "Order cancelled because payment failed: " +
                event.getOrderId()
        );

        // ==========================================
        // CONVERT ORDER ITEMS TO EVENT ITEMS
        // ==========================================

        List<OrderItemEvent> itemEvents =
                order.getItems()
                        .stream()
                        .map(item ->
                                new OrderItemEvent(
                                        item.getProductId(),
                                        item.getQuantity()
                                )
                        )
                        .toList();

        // ==========================================
        // CREATE ORDER CANCELLED EVENT
        // ==========================================

        OrderCancelledEvent cancelledEvent =
                new OrderCancelledEvent(
                        event.getOrderId(),
                        event.getUserId(),
                        event.getAmount(),
                        event.getReason(),
                        itemEvents
                );

        // ==========================================
        // PUBLISH ORDER CANCELLED EVENT
        // ==========================================

        kafkaTemplate.send(
                "order-cancelled",
                cancelledEvent
        );

        System.out.println(
                "Published OrderCancelledEvent: " +
                "orderId=" + event.getOrderId() +
                ", items=" + itemEvents.size() +
                ", reason=" + event.getReason()
        );
    }
}