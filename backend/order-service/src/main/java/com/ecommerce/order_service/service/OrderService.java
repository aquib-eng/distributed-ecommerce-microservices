package com.ecommerce.order_service.service;

import com.ecommerce.order_service.dto.CreateOrderRequest;
import com.ecommerce.order_service.dto.OrderItemRequest;
import com.ecommerce.order_service.dto.OrderItemResponse;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.model.Order;
import com.ecommerce.order_service.model.OrderItem;
import com.ecommerce.order_service.repository.OrderRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

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

        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(UUID userId) {

        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(
            UUID userId,
            UUID orderId
    ) {

        Order order = orderRepository
                .findByOrderIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );

        return convertToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(
            UUID userId,
            UUID orderId
    ) {

        Order order = orderRepository
                .findByOrderIdAndUserId(orderId, userId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        if ("CONFIRMED".equals(order.getStatus())) {
            throw new RuntimeException(
                    "Confirmed order cannot be cancelled"
            );
        }

        order.setStatus("CANCELLED");

        Order updatedOrder = orderRepository.save(order);

        return convertToResponse(updatedOrder);
    }

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