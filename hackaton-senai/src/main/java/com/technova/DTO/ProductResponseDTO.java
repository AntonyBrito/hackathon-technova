package com.technova.DTO;
import lombok.Data;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private int quantity;
    private String imageUrl;
    private String sellerName; // Apenas o nome do vendedor, não o objeto inteiro
}