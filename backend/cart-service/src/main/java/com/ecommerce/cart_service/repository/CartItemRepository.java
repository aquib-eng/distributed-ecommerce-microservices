package com.ecommerce.cart_service.repository;

import com.ecommerce.cart_service.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    List<CartItem> findByCartCartId(UUID cartId);

    Optional<CartItem> findByCartCartIdAndProductId(
            UUID cartId,
            String productId
    );

    void deleteByCartCartId(UUID cartId);
}
