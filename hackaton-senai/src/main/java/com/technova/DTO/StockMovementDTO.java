package com.technova.DTO;

import com.technova.Entity.StockMovement;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StockMovementDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer quantityChange;
    private StockMovement.MovementType type;
    private LocalDateTime timestamp;
}