package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.Brand;
import com.autokereskedes.backend.repository.BrandRepository;
import com.autokereskedes.backend.repository.ModelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BrandModelController {

    private final BrandRepository brandRepository;
    private final ModelRepository modelRepository;

    @GetMapping("/brands")
    public List<String> getBrands() {
        return brandRepository.findAll().stream()
                .map(com.autokereskedes.backend.model.Brand::getName)
                .sorted(String::compareToIgnoreCase)
                .toList();
    }

    @GetMapping("/models")
    public List<String> getModels(@RequestParam String brand) {
        Brand b = brandRepository.findByNameIgnoreCase(brand)
                .orElseThrow(() -> new IllegalArgumentException("Ismeretlen márka: " + brand));

        return modelRepository.findByBrand(b).stream()
                .map(com.autokereskedes.backend.model.Model::getName) 
                .sorted(String::compareToIgnoreCase)
                .toList();
    }
}
