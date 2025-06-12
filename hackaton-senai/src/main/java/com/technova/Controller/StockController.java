package com.technova.Controller;

import com.technova.DTO.ProductDTO;
import com.technova.DTO.StockMovementDTO;
import com.technova.DTO.StockSummaryDTO;
import com.technova.Service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/summary")
    public ResponseEntity<StockSummaryDTO> getStockSummary() {
        return ResponseEntity.ok(stockService.getStockSummary());
    }

    @GetMapping("/history")
    public ResponseEntity<List<StockMovementDTO>> getStockHistory() {
        return ResponseEntity.ok(stockService.getStockHistory());
    }

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout(@RequestBody List<ProductDTO> checkoutItems) {
        try {
            stockService.processCheckout(checkoutItems);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}