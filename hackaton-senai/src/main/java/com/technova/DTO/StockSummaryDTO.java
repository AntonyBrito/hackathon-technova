package com.technova.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockSummaryDTO {
    private BigDecimal totalInventoryValue;
    private Long totalUnits;
    private List<ProductDTO> lowStockProducts;
}