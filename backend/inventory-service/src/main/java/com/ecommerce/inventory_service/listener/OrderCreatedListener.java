package com.ecommerce.inventory_service.listener;

import com.ecommerce.inventory_service.event.OrderCreatedEvent;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedListener {

    @KafkaListener(
            topics = "order-created",
            groupId = "inventory-service"
    )
    public void handleOrderCreated(OrderCreatedEvent event) {

        System.out.println(
                "Received OrderCreatedEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", totalAmount=" + event.getTotalAmount()
        );
    }
}