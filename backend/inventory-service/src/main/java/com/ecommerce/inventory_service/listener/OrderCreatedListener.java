
package com.ecommerce.inventory_service.listener;

import com.ecommerce.inventory_service.event.OrderCreatedEvent;
import com.ecommerce.inventory_service.event.OrderItemEvent;
import com.ecommerce.inventory_service.service.InventoryService;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedListener {

    private final InventoryService inventoryService;

    public OrderCreatedListener(
            InventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }

    @KafkaListener(
            topics = "order-created",
            groupId = "inventory-service"
    )
    public void handleOrderCreated(
            OrderCreatedEvent event) {

        System.out.println(
                "Received OrderCreatedEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", totalAmount=" + event.getTotalAmount()
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
        }
    }
}

