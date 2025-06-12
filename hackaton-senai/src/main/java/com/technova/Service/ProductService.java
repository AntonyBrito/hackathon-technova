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
        List<Product> allProducts = productRepository.findAll();

        BigDecimal totalInventoryValue = allProducts.stream()
                .filter(p -> p.getPrice() != null && p.getQuantity() != null)
                .map(p -> p.getPrice().multiply(new BigDecimal(p.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalUnits = allProducts.stream()
                .filter(p -> p.getQuantity() != null)
                .mapToLong(Product::getQuantity)
                .sum();

        List<ProductDTO> lowStockProducts = allProducts.stream()
                .filter(p -> p.getQuantity() != null && p.getQuantity() < LOW_STOCK_THRESHOLD)
                .map(this::convertProductToDto)
                .collect(Collectors.toList());

        StockSummaryDTO summary = new StockSummaryDTO();
        summary.setTotalInventoryValue(totalInventoryValue);
        summary.setTotalUnits(totalUnits);
        summary.setLowStockProducts(lowStockProducts);

        return summary;
    }

    @Transactional
    public void processCheckout(List<ProductDTO> checkoutItems) {
        for (ProductDTO item : checkoutItems) {
            Product product = productRepository.findById(item.getId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + item.getId()));

            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName());
            }

            int newQuantity = product.getQuantity() - item.getQuantity();
            product.setQuantity(newQuantity);
            productRepository.save(product);

            StockMovement movement = new StockMovement(
                    product,
                    -item.getQuantity(),
                    StockMovement.MovementType.SAIDA_VENDA,
                    LocalDateTime.now()
            );
            stockMovementRepository.save(movement);
        }
    }

    @Transactional(readOnly = true)
    public List<StockMovementDTO> getStockHistory() {
        Pageable limit = PageRequest.of(0, 50);
        List<StockMovement> movements = stockMovementRepository.findRecentHistory(limit);
        return movements.stream()
                .map(this::convertMovementToDto)
                .collect(Collectors.toList());
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
        dto.setImageUrls(product.getImageUrls());
        return dto;
    }
}