package com.technova.Service;

import com.technova.DTO.ProductDTO;
import com.technova.DTO.StockMovementDTO;
import com.technova.DTO.StockSummaryDTO;
import com.technova.Entity.Product;
import com.technova.Entity.StockMovement;
import com.technova.Repository.ProductRepository;
import com.technova.Repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    private static final int LOW_STOCK_THRESHOLD = 5;

    @Transactional(readOnly = true)
    public StockSummaryDTO getStockSummary() {
        StockSummaryDTO summary = new StockSummaryDTO();
        List<Product> allProducts = productRepository.findAll();

        BigDecimal totalValue = allProducts.stream()
                .map(p -> p.getPrice().multiply(BigDecimal.valueOf(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalUnits = allProducts.stream()
                .mapToLong(Product::getQuantity)
                .sum();

        List<ProductDTO> lowStockProducts = allProducts.stream()
                .filter(p -> p.getQuantity() < LOW_STOCK_THRESHOLD)
                .map(this::convertToDto)
                .collect(Collectors.toList());

        summary.setTotalInventoryValue(totalValue);
        summary.setTotalUnits(totalUnits);
        summary.setLowStockProducts(lowStockProducts);

        return summary;
    }

    @Transactional(readOnly = true)
    public List<StockMovementDTO> getStockHistory() {
        return stockMovementRepository.findRecentHistory().stream()
                .map(this::convertMovementToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void processCheckout(List<ProductDTO> checkoutItems) {
        for (ProductDTO item : checkoutItems) {
            Product product = productRepository.findById(item.getId())
                    .orElseThrow(() -> new RuntimeException("Produto com ID " + item.getId() + " não encontrado durante o checkout."));

            int newQuantity = product.getQuantity() - item.getQuantity();
            if (newQuantity < 0) {
                throw new IllegalStateException("Estoque insuficiente para " + product.getName());
            }
            product.setQuantity(newQuantity);
            productRepository.save(product);

            StockMovement movement = new StockMovement(product, -item.getQuantity(), StockMovement.MovementType.SAIDA_VENDA, LocalDateTime.now());
            stockMovementRepository.save(movement);
        }
    }

    private ProductDTO convertToDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setImageUrls(product.getImageUrls());
        dto.setManufacturer(product.getManufacturer());
        dto.setColor(product.getColor());
        dto.setDescription(product.getDescription());
        return dto;
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
}