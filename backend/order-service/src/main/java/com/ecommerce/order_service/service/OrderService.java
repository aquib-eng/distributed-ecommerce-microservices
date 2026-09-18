package com.ecommerce.order_service.service;

import com.ecommerce.order_service.dto.CreateOrderRequest;
import com.ecommerce.order_service.dto.OrderItemRequest;
import com.ecommerce.order_service.dto.OrderItemResponse;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.event.OrderCreatedEvent;
import com.ecommerce.order_service.exception.OrderNotFoundException;
import com.ecommerce.order_service.model.Order;
import com.ecommerce.order_service.model.OrderItem;
import com.ecommerce.order_service.repository.OrderRepository;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderService(
            OrderRepository orderRepository,
            KafkaTemplate<String, Object> kafkaTemplate
    ) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    // CREATE ORDER
    @Transactional
    public OrderResponse createOrder(
            UUID userId,
            CreateOrderRequest request
    ) {

        Order order = new Order(userId);

        double totalAmount = 0.0;

        for (OrderItemRequest itemRequest : request.getItems()) {

            OrderItem item = new OrderItem(
                    itemRequest.getProductId(),
                    itemRequest.getQuantity(),
                    itemRequest.getPrice()
            );

            item.setOrder(order);

            order.getItems().add(item);

            totalAmount +=
                    itemRequest.getPrice()
                            * itemRequest.getQuantity();
        }

        order.setTotalAmount(totalAmount);

        // Save order to PostgreSQL
        Order savedOrder = orderRepository.save(order);

        // Create Kafka event
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getOrderId(),
                savedOrder.getUserId(),
                savedOrder.getTotalAmount()
        );

        // Publish event to Kafka
        kafkaTemplate.send("order-created", event);

        return convertToResponse(savedOrder);
    }


    // GET ALL USER ORDERS
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(UUID userId) {

        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // GET SINGLE ORDER
    @Transactional(readOnly = true)
    public OrderResponse getOrder(
            UUID userId,
            UUID orderId
    ) {

        Order order = orderRepository
                .findByOrderIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new OrderNotFoundException(
                                "Order not found with id: " + orderId
                        )
                );

        return convertToResponse(order);
    }


    // CANCEL ORDER
    @Transactional
    public OrderResponse cancelOrder(
            UUID userId,
            UUID orderId
    ) {

        Order order = orderRepository
                .findByOrderIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new OrderNotFoundException(
                                "Order not found with id: " + orderId
                        )
                );


        // Already cancelled
        if ("CANCELLED".equals(order.getStatus())) {

            throw new IllegalArgumentException(
                    "Order is already cancelled"
            );
        }


        // Confirmed orders cannot be cancelled
        if ("CONFIRMED".equals(order.getStatus())) {

            throw new IllegalArgumentException(
                    "Confirmed order cannot be cancelled"
            );
        }


        order.setStatus("CANCELLED");

        Order updatedOrder =
                orderRepository.save(order);

        return convertToResponse(updatedOrder);
    }


    // CONVERT ENTITY → RESPONSE
    private OrderResponse convertToResponse(Order order) {

        List<OrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getOrderItemId(),
                                        item.getProductId(),
                                        item.getQuantity(),
                                        item.getPrice()
                                )
                        )
                        .toList();

        return new OrderResponse(
                order.getOrderId(),
                order.getUserId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                items
        );
    }
}