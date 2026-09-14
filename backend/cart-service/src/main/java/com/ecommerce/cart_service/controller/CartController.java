package com.ecommerce.cart_service.controller;

import com.ecommerce.cart_service.dto.AddCartItemRequest;
import com.ecommerce.cart_service.dto.CartResponse;
import com.ecommerce.cart_service.dto.UpdateCartItemRequest;
import com.ecommerce.cart_service.service.CartService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /*
     * Get authenticated user's cart.
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @RequestHeader("X-User-Id") String userId) {

        UUID userUUID = UUID.fromString(userId);

        return ResponseEntity.ok(
                cartService.getCart(userUUID)
        );
    }

    /*
     * Add product to authenticated user's cart.
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody AddCartItemRequest request) {

        UUID userUUID = UUID.fromString(userId);

        CartResponse response =
                cartService.addItem(
                        userUUID,
                        request.getProductId(),
                        request.getQuantity(),
                        request.getPrice()
                );

        return ResponseEntity.ok(response);
    }

    /*
     * Update product quantity.
     */
    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateItem(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String productId,
            @Valid @RequestBody UpdateCartItemRequest request) {

        UUID userUUID = UUID.fromString(userId);

        CartResponse response =
                cartService.updateItemQuantity(
                        userUUID,
                        productId,
                        request.getQuantity()
                );

        return ResponseEntity.ok(response);
    }

    /*
     * Remove one product.
     */
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItem(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String productId) {

        UUID userUUID = UUID.fromString(userId);

        cartService.removeItem(
                userUUID,
                productId
        );

        return ResponseEntity.noContent().build();
    }

    /*
     * Clear entire cart.
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @RequestHeader("X-User-Id") String userId) {

        UUID userUUID = UUID.fromString(userId);

        cartService.clearCart(userUUID);

        return ResponseEntity.noContent().build();
    }
}