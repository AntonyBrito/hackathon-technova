package com.technova.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @OneToMany(mappedBy = "seller")
    private List<Product> products;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;
}