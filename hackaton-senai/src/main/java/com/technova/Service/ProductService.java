package com.technova.Service;

import com.technova.DTO.ProductRequestDTO;
import com.technova.DTO.ProductResponseDTO;
import com.technova.Entity.Product;
import com.technova.Entity.User;
import com.technova.Repository.ProductRepository;
import com.technova.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository; // Precisamos para encontrar o vendedor

    // Método para cadastrar um produto
    public ProductResponseDTO addProduct(ProductRequestDTO requestDTO) {
        // Encontra o usuário (vendedor) pelo ID fornecido no DTO
        User seller = userRepository.findById(requestDTO.getSellerId())
                .orElseThrow(() -> new RuntimeException("Vendedor não encontrado com o ID: " + requestDTO.getSellerId()));

        // Converte o DTO em uma entidade Product
        Product product = new Product();
        product.setName(requestDTO.getName());
        product.setDescription(requestDTO.getDescription());
        product.setPrice(requestDTO.getPrice());
        product.setQuantity(requestDTO.getQuantity());
        product.setImageUrl(requestDTO.getImageUrl()); // Atribui a URL da imagem
        product.setSeller(seller); // Associa o produto ao vendedor

        // Salva o produto no banco de dados
        Product savedProduct = productRepository.save(product);

        // Converte a entidade salva em um DTO de resposta para enviar ao frontend
        return toProductResponseDTO(savedProduct);
    }

    // Método para listar todos os produtos
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toProductResponseDTO)
                .collect(Collectors.toList());
    }

    // Método auxiliar para converter Entidade -> DTO
    private ProductResponseDTO toProductResponseDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setSellerName(product.getSeller().getName());
        return dto;
    }
}