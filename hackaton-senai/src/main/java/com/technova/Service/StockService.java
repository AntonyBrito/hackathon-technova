package com.technova.Service;

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

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StockService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;

    @Autowired
    public StockService(StockMovementRepository stockMovementRepository, ProductRepository productRepository) {
        this.stockMovementRepository = stockMovementRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<StockSummaryDTO> getStockSummary() {
        return productRepository.findAll().stream()
                .map(product -> new StockSummaryDTO(product.getId(), product.getName(), product.getQuantity()))
                .collect(Collectors.toList());
    }

    public void recordStockMovement(StockMovementDTO movementDTO) {
        Product product = productRepository.findById(movementDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + movementDTO.getProductId()));

        // CORREÇÃO: Usando o método getQuantityChange() da sua DTO
        int quantityChange = movementDTO.getQuantityChange();
        if (StockMovement.MovementType.OUT.equals(movementDTO.getType())) {
            quantityChange = -quantityChange;
        }

        product.setQuantity(product.getQuantity() + quantityChange);
        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        // CORREÇÃO: A entidade StockMovement usa setQuantity, então pegamos o valor da DTO
        movement.setQuantityChange(movementDTO.getQuantityChange());
        // CORREÇÃO: A entidade StockMovement espera uma String, então convertemos o Enum
        movement.setType(movementDTO.getType().name());
        movement.setTimestamp(ZonedDateTime.now()); // Usando ZonedDateTime para consistência
        stockMovementRepository.save(movement);
    }

    @Transactional(readOnly = true)
    public List<StockMovementDTO> getStockHistory() {
        Pageable limit = PageRequest.of(0, 50);
        return stockMovementRepository.findRecentHistory(limit).stream()
                .map(this::convertMovementToDto)
                .collect(Collectors.toList());
    }

    private StockMovementDTO convertMovementToDto(StockMovement movement) {
        // CORREÇÃO: Criando a DTO e preenchendo campo por campo para evitar erros de construtor
        StockMovementDTO dto = new StockMovementDTO();
        dto.setId(movement.getId());
        dto.setProductId(movement.getProduct().getId());
        dto.setProductName(movement.getProduct().getName());
        // CORREÇÃO: A DTO espera 'quantityChange', a entidade tem 'quantity'
        dto.setQuantityChange(movement.getQuantityChange());
        // CORREÇÃO: Convertendo a String da entidade para o Enum da DTO
        dto.setType(StockMovement.MovementType.valueOf(movement.getType()));
        // CORREÇÃO: Convertendo ZonedDateTime para LocalDateTime, se necessário
        if (movement.getTimestamp() != null) {
            dto.setTimestamp(movement.getTimestamp().toLocalDateTime());
        }
        return dto;
    }
}