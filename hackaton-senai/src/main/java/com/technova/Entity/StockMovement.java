package com.technova.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
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
        ENTRADA_INICIAL, // Quando um produto é cadastrado pela primeira vez
        AJUSTE_MANUAL,   // Quando o estoque é alterado manualmente (ex: edição)
        SAIDA_VENDA      // Quando uma venda é finalizada
    }

    public StockMovement(Product product, Integer quantityChange, MovementType type, LocalDateTime timestamp) {
        this.product = product;
        this.quantityChange = quantityChange;
        this.type = type;
        this.timestamp = timestamp;
    }
}