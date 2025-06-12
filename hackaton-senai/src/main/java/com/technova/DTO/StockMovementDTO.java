package com.technova.DTO;

import com.technova.Entity.StockMovement;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StockMovementDTO {
    private Long id;
    private String productName;
    private Long productId;
    private Integer quantityChange;
    private StockMovement.MovementType type;
    private LocalDateTime timestamp;
}