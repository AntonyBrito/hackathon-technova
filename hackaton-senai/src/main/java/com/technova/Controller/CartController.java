package com.technova.Controller;

import com.technova.DTO.AddItemToCartRequestDTO;
import com.technova.DTO.CartResponseDTO;
import com.technova.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts") // Mudamos o path base para "carts"
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    // Endpoint para obter o conteúdo de um carrinho
    @GetMapping("/{cartId}")
    public ResponseEntity<CartResponseDTO> getCart(@PathVariable Long cartId) {
        return ResponseEntity.ok(cartService.getCartById(cartId));
    }

    // Endpoint para adicionar um item ao carrinho
    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartResponseDTO> addItemToCart(
            @PathVariable Long cartId,
            @RequestBody AddItemToCartRequestDTO requestDTO) {
        return ResponseEntity.ok(cartService.addProductToCart(cartId, requestDTO));
    }

    // Endpoint para simular a compra
    @PostMapping("/{cartId}/purchase")
    public ResponseEntity<Void> purchase(@PathVariable Long cartId) {
        cartService.purchase(cartId);
        return ResponseEntity.ok().build();
    }
}