package com.technova.Service;

import com.technova.DTO.ProductDTO;
import com.technova.Entity.Product;
import com.technova.Entity.StockMovement;
import com.technova.Repository.ProductRepository;
import com.technova.Repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = convertToEntity(productDTO);
        Product savedProduct = productRepository.save(product);

        StockMovement movement = new StockMovement(savedProduct, savedProduct.getQuantity(), StockMovement.MovementType.ENTRADA_INICIAL, LocalDateTime.now());
        stockMovementRepository.save(movement);

        return convertToDto(savedProduct);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        if (productDTO.getQuantity() < 0) {
            throw new IllegalArgumentException("A quantidade do produto não pode ser negativa.");
        }

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found for update with id: " + id));

        int quantityChange = productDTO.getQuantity() - existingProduct.getQuantity();

        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setColor(productDTO.getColor());
        existingProduct.setManufacturer(productDTO.getManufacturer());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setImageUrls(productDTO.getImageUrls());

        Product updatedProduct = productRepository.save(existingProduct);

        if (quantityChange != 0) {
            StockMovement movement = new StockMovement(updatedProduct, quantityChange, StockMovement.MovementType.AJUSTE_MANUAL, LocalDateTime.now());
            stockMovementRepository.save(movement);
        }

        return convertToDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found for deletion with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductDTO convertToDto(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setColor(product.getColor());
        dto.setManufacturer(product.getManufacturer());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setImageUrls(new ArrayList<>(product.getImageUrls()));
        return dto;
    }

    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setColor(productDTO.getColor());
        product.setManufacturer(productDTO.getManufacturer());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setImageUrls(productDTO.getImageUrls());
        return product;
    }
}