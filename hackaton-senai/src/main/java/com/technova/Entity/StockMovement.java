package com.technova.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "stock_movement")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantityChange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public enum MovementType {
        ENTRADA_INICIAL,
        AJUSTE_MANUAL,
        SAIDA_VENDA
    }

    public StockMovement(Product product, Integer quantityChange, MovementType type, LocalDateTime timestamp) {
        this.product = product;
        this.quantityChange = quantityChange;
        this.type = type;
        this.timestamp = timestamp;
    }
}