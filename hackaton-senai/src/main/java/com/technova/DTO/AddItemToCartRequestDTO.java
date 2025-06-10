package com.technova.DTO;

import lombok.Data;

@Data
public class AddItemToCartRequestDTO {
    private Long productId;
    private int quantity;
}