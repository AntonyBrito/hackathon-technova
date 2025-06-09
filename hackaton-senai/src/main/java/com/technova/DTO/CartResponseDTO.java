package com.technova.DTO;

import lombok.Data;
import java.util.List;

@Data
public class CartResponseDTO {
    private Long id;
    private Long userId;
    private List<CartItemResponseDTO> items;
    private double totalPrice;
}