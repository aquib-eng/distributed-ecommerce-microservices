package com.ecommerce.cart_service.service;

import com.ecommerce.cart_service.dto.CartItemResponse;
import com.ecommerce.cart_service.dto.CartResponse;
import com.ecommerce.cart_service.model.Cart;
import com.ecommerce.cart_service.model.CartItem;
import com.ecommerce.cart_service.repository.CartItemRepository;
import com.ecommerce.cart_service.repository.CartRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    /*
     * Get existing cart or create a new cart for the user.
     */
    public Cart getOrCreateCart(UUID userId) {

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {

                    Cart cart = new Cart(userId);

                    return cartRepository.save(cart);
                });
    }

    /*
     * Convert Cart Entity to CartResponse DTO.
     *
     * This prevents:
     *
     * Cart -> CartItem -> Cart -> CartItem
     *
     * recursive JSON.
     */
    private CartResponse convertToResponse(Cart cart) {

        List<CartItemResponse> items =
                cart.getItems()
                        .stream()
                        .map(item ->
                                new CartItemResponse(
                                        item.getProductId(),
                                        item.getQuantity(),
                                        item.getPrice(),
                                        item.getAddedAt()
                                )
                        )
                        .toList();

        return new CartResponse(
                cart.getCartId().toString(),
                cart.getUserId().toString(),
                cart.getCreatedAt(),
                items
        );
    }

    /*
     * Get cart for a user.
     */
    @Transactional
    public CartResponse getCart(UUID userId) {

        Cart cart = getOrCreateCart(userId);

        return convertToResponse(cart);
    }

    /*
     * Add a product to the user's cart.
     *
     * If the product already exists:
     * quantity is increased.
     *
     * Otherwise:
     * a new CartItem is created.
     */
    @Transactional
    public CartResponse addItem(
            UUID userId,
            String productId,
            Integer quantity,
            Double price) {

        Cart cart = getOrCreateCart(userId);

        CartItem existingItem =
                cartItemRepository
                        .findByCartCartIdAndProductId(
                                cart.getCartId(),
                                productId
                        )
                        .orElse(null);

        if (existingItem != null) {

            existingItem.setQuantity(
                    existingItem.getQuantity() + quantity
            );

            cartItemRepository.save(existingItem);

        } else {

            CartItem newItem =
                    new CartItem(
                            productId,
                            quantity,
                            price
                    );

            newItem.setCart(cart);

            cart.getItems().add(newItem);

            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);

        return convertToResponse(cart);
    }

    /*
     * Update quantity of an existing product.
     */
    @Transactional
    public CartResponse updateItemQuantity(
            UUID userId,
            String productId,
            Integer quantity) {

        Cart cart = getOrCreateCart(userId);

        CartItem item =
                cartItemRepository
                        .findByCartCartIdAndProductId(
                                cart.getCartId(),
                                productId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found in cart"
                                )
                        );

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return convertToResponse(cart);
    }

    /*
     * Remove one product from the cart.
     */
    @Transactional
    public void removeItem(
            UUID userId,
            String productId) {

        Cart cart = getOrCreateCart(userId);

        CartItem item =
                cartItemRepository
                        .findByCartCartIdAndProductId(
                                cart.getCartId(),
                                productId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found in cart"
                                )
                        );

        cart.getItems().remove(item);

        cartItemRepository.delete(item);
    }

    /*
     * Remove all items from the user's cart.
     */
    @Transactional
    public void clearCart(UUID userId) {

        Cart cart = getOrCreateCart(userId);

        cartItemRepository.deleteByCartCartId(
                cart.getCartId()
        );

        cart.getItems().clear();

        cartRepository.save(cart);
    }
}