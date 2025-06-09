package com.technova.Controller;

import com.technova.DTO.ProductRequestDTO;
import com.technova.DTO.ProductResponseDTO;
import com.technova.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // o caminho do front
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ProductResponseDTO addProduct(@RequestBody ProductRequestDTO productRequestDTO) {
        return productService.addProduct(productRequestDTO);
    }

    @GetMapping
    public List<ProductResponseDTO> getAllProducts() {
        return productService.getAllProducts();
    }
}