package com.autokereskedes.backend.controller;
import com.autokereskedes.backend.model.Brand;
import com.autokereskedes.backend.repository.BrandRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:3000")
public class BrandController {
    private final BrandRepository brandRepository;

    public BrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
}
