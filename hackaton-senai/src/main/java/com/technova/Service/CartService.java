package com.technova.Service;

import com.technova.DTO.AddItemToCartRequestDTO;
import com.technova.DTO.CartItemResponseDTO;
import com.technova.DTO.CartResponseDTO;
import com.technova.Entity.Cart;
import com.technova.Entity.CartItem;
import com.technova.Entity.Product;
import com.technova.Repository.CartRepository;
import com.technova.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public CartResponseDTO addProductToCart(Long cartId, AddItemToCartRequestDTO requestDTO) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));
        Product product = productRepository.findById(requestDTO.getProductId()).orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (product.getQuantity() < requestDTO.getQuantity()) {
            throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName());
        }

        // Verifica se o produto já está no carrinho
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(requestDTO.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Se já existe, apenas atualiza a quantidade
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + requestDTO.getQuantity());
        } else {
            // Se não existe, cria um novo CartItem
            CartItem newItem = new CartItem(product, requestDTO.getQuantity(), cart);
            cart.getItems().add(newItem);
        }

        Cart updatedCart = cartRepository.save(cart);
        return toCartResponseDTO(updatedCart);
    }

    @Transactional
    public void purchase(Long cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            int newQuantity = product.getQuantity() - item.getQuantity();
            if (newQuantity < 0) {
                throw new RuntimeException("Erro: Estoque ficou negativo para o produto: " + product.getName());
            }
            product.setQuantity(newQuantity);
            productRepository.save(product);
        }

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartResponseDTO getCartById(Long cartId) {
        Cart cart = cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));
        return toCartResponseDTO(cart);
    }


    private CartResponseDTO toCartResponseDTO(Cart cart) {
        CartResponseDTO cartDTO = new CartResponseDTO();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());

        cartDTO.setItems(cart.getItems().stream().map(item -> {
            CartItemResponseDTO itemDTO = new CartItemResponseDTO();
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setProductPrice(item.getProduct().getPrice());
            itemDTO.setImageUrl(item.getProduct().getImageUrl());
            itemDTO.setQuantity(item.getQuantity());
            return itemDTO;
        }).collect(Collectors.toList()));

        double totalPrice = cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        cartDTO.setTotalPrice(totalPrice);

        return cartDTO;
    }
}