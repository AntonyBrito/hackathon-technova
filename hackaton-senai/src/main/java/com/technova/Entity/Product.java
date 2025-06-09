package com.technova.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private int quantity;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;
}