package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Brand;
import com.autokereskedes.backend.repository.ModelRepository;
import com.autokereskedes.backend.repository.BrandRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/models")
@CrossOrigin(origins = "http://localhost:3000")
public class ModelController {
    private final ModelRepository modelRepository;
    private final BrandRepository brandRepository;

    public ModelController(ModelRepository modelRepository, BrandRepository brandRepository) {
        this.modelRepository = modelRepository;
        this.brandRepository = brandRepository;
    }
    @GetMapping("/by-brand/{brandName}")
    public List<Model> getModelsByBrand(@PathVariable String brandName) {
        Brand brand = brandRepository.findByNameIgnoreCase(brandName)
                .orElseThrow(() -> new RuntimeException("Márka nem található: " + brandName));
        return modelRepository.findByBrand(brand);
    }

    @GetMapping("/by-brand/{brandName}/filter")
    public List<Model> getModelsByBrandAndCategory(
            @PathVariable String brandName,
            @RequestParam(required = false) String category) {

        Brand brand = brandRepository.findByNameIgnoreCase(brandName)
                .orElseThrow(() -> new RuntimeException("Márka nem található: " + brandName));

        if (category != null && !category.isBlank()) {
            return modelRepository.findByBrandAndCategoryIgnoreCase(brand, category);
        } else {
            return modelRepository.findByBrand(brand);
        }
    }
}
