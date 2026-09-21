package com.ecommerce.inventory_service.listener;

import com.ecommerce.inventory_service.event.InventoryReservedEvent;
import com.ecommerce.inventory_service.event.OrderCreatedEvent;
import com.ecommerce.inventory_service.event.OrderItemEvent;
import com.ecommerce.inventory_service.service.InventoryService;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedListener {

    private final InventoryService inventoryService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderCreatedListener(
            InventoryService inventoryService,
            KafkaTemplate<String, Object> kafkaTemplate) {

        this.inventoryService = inventoryService;
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(
            topics = "order-created",
            groupId = "inventory-service"
    )
    public void handleOrderCreated(OrderCreatedEvent event) {

        System.out.println(
                "Received OrderCreatedEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", totalAmount=" + event.getTotalAmount() +
                ", paymentMethod=" + event.getPaymentMethod()
        );

        if (event.getItems() == null ||
                event.getItems().isEmpty()) {

            System.out.println(
                    "No order items found in OrderCreatedEvent"
            );

            return;
        }

        for (OrderItemEvent item : event.getItems()) {

            System.out.println(
                    "Reserving inventory: " +
                    "productId=" + item.getProductId() +
                    ", quantity=" + item.getQuantity()
            );

            inventoryService.reserveStock(
                    item.getProductId(),
                    item.getQuantity()
            );

            InventoryReservedEvent reservedEvent =
                    new InventoryReservedEvent(
                            event.getOrderId(),
                            event.getUserId(),
                            event.getTotalAmount(),
                            event.getPaymentMethod(),
                            item.getProductId(),
                            item.getQuantity()
                    );

            kafkaTemplate.send(
                    "inventory-reserved",
                    reservedEvent
            );

            System.out.println(
                    "Published InventoryReservedEvent: " +
                    "orderId=" + event.getOrderId() +
                    ", productId=" + item.getProductId() +
                    ", quantity=" + item.getQuantity() +
                    ", paymentMethod=" + event.getPaymentMethod()
            );
        }
    }
}