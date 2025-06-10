package com.technova.DTO;

import lombok.Data;

@Data
public class ProductRequestDTO {
    private String name;
    private String description;
    private double price;
    private int quantity;
    private String imageUrl;
    private Long sellerId; // ID do usuário que está vendendo o produto
}