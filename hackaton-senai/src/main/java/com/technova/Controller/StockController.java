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
        StockSummaryDTO summary = stockService.getStockSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/history")
    public ResponseEntity<List<StockMovementDTO>> getStockHistory() {
        List<StockMovementDTO> history = stockService.getStockHistory();
        return ResponseEntity.ok(history);
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody List<ProductDTO> checkoutItems) {
        try {
            stockService.processCheckout(checkoutItems);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            // Retorna uma resposta 400 Bad Request com a mensagem de erro
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Retorna um erro genérico do servidor para outros problemas
            return ResponseEntity.internalServerError().body("Ocorreu um erro inesperado ao processar a compra.");
        }
    }
}