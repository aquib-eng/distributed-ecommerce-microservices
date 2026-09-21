package com.ecommerce.inventory_service.listener;

import com.ecommerce.inventory_service.event.OrderCancelledEvent;
import com.ecommerce.inventory_service.event.OrderItemEvent;
import com.ecommerce.inventory_service.service.InventoryService;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderCancelledListener {

    private final InventoryService inventoryService;

    public OrderCancelledListener(
            InventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }

    @KafkaListener(
            topics = "order-cancelled",
            groupId = "inventory-cancellation-service",
            containerFactory =
                    "orderCancelledKafkaListenerContainerFactory"
    )
    public void handleOrderCancelled(
            OrderCancelledEvent event) {

        System.out.println(
                "Received OrderCancelledEvent: " +
                "orderId=" + event.getOrderId() +
                ", userId=" + event.getUserId() +
                ", amount=" + event.getAmount() +
                ", reason=" + event.getReason()
        );

        if (event.getItems() == null ||
                event.getItems().isEmpty()) {

            System.out.println(
                    "No order items found in OrderCancelledEvent"
            );

            return;
        }

        for (OrderItemEvent item : event.getItems()) {

            System.out.println(
                    "Releasing reserved inventory: " +
                    "productId=" + item.getProductId() +
                    ", quantity=" + item.getQuantity()
            );

            inventoryService.releaseStock(
                    item.getProductId(),
                    item.getQuantity()
            );

            System.out.println(
                    "Inventory released successfully: " +
                    "productId=" + item.getProductId() +
                    ", quantity=" + item.getQuantity()
            );
        }

        System.out.println(
                "Order cancellation compensation completed: " +
                "orderId=" + event.getOrderId()
        );
    }
}