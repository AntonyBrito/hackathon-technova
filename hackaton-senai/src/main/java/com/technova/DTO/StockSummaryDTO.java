package com.technova.DTO;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class StockSummaryDTO {
    private BigDecimal totalInventoryValue;
    private Long totalUnits;
    private List<ProductDTO> lowStockProducts;
}