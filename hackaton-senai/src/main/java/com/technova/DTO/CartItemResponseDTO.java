package com.technova.DTO;

import lombok.Data;

@Data
public class CartItemResponseDTO {
    private Long productId;
    private String productName;
    private double productPrice;
    private String imageUrl;
    private int quantity;
}