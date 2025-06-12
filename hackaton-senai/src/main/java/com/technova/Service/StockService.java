package com.technova.Service;

import com.technova.DTO.ProductDTO;
import com.technova.DTO.StockMovementDTO;
import com.technova.DTO.StockSummaryDTO;
import com.technova.Entity.Product;
import com.technova.Entity.StockMovement;
import com.technova.Repository.ProductRepository;
import com.technova.Repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {

    private static final int LOW_STOCK_THRESHOLD = 5;
    private static final int HISTORY_PAGE_SIZE = 50;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @Transactional(readOnly = true)
    public StockSummaryDTO getStockSummary() {
        List<Product> allProducts = productRepository.findAll();

        BigDecimal totalValue = BigDecimal.ZERO;
        long totalUnits = 0L;

        for (Product product : allProducts) {
            if (product.getPrice() != null && product.getQuantity() > 0) {
                totalValue = totalValue.add(
                        product.getPrice().multiply(BigDecimal.valueOf(product.getQuantity()))
                );
            }
            totalUnits += product.getQuantity();
        }

        List<ProductDTO> lowStockProducts = allProducts.stream()
                .filter(p -> p.getQuantity() < LOW_STOCK_THRESHOLD)
                .map(this::convertProductToDto)
                .collect(Collectors.toList());

        StockSummaryDTO summary = new StockSummaryDTO();
        summary.setTotalInventoryValue(totalValue);
        summary.setTotalUnits(totalUnits);
        summary.setLowStockProducts(lowStockProducts);

        return summary;
    }

    @Transactional(readOnly = true)
    public List<StockMovementDTO> getStockHistory() {
        Pageable limit = PageRequest.of(0, HISTORY_PAGE_SIZE);
        return stockMovementRepository.findRecentHistory(limit).stream()
                .map(this::convertMovementToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void processCheckout(List<ProductDTO> checkoutItems) {
        for (ProductDTO item : checkoutItems) {
            Product product = productRepository.findById(item.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto com ID " + item.getId() + " não encontrado."));

            if (product.getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Estoque insuficiente para o produto: " + product.getName());
            }

            // Diminui o estoque
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);

            // Registra a movimentação de saída
            StockMovement movement = new StockMovement(
                    product,
                    -item.getQuantity(), // Quantidade negativa para indicar saída
                    StockMovement.MovementType.SAIDA_VENDA,
                    LocalDateTime.now()
            );
            stockMovementRepository.save(movement);
        }
    }

    private StockMovementDTO convertMovementToDto(StockMovement movement) {
        StockMovementDTO dto = new StockMovementDTO();
        dto.setId(movement.getId());
        dto.setProductId(movement.getProduct().getId());
        dto.setProductName(movement.getProduct().getName());
        dto.setQuantityChange(movement.getQuantityChange());
        dto.setType(movement.getType());
        dto.setTimestamp(movement.getTimestamp());
        return dto;
    }

    private ProductDTO convertProductToDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setColor(product.getColor());
        dto.setManufacturer(product.getManufacturer());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        // Garante que a lista de URLs nunca seja nula
        dto.setImageUrls(product.getImageUrls() != null ? new ArrayList<>(product.getImageUrls()) : new ArrayList<>());
        return dto;
    }
}