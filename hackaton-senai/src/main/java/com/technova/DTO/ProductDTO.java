package com.technova.DTO;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private String color;
    private String manufacturer;
    private BigDecimal price;
    private Integer quantity;
    private List<String> imageUrls;

}