package com.autokereskedes.backend.controller;
import com.autokereskedes.backend.model.Appearance;
import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Variant;
import com.autokereskedes.backend.repository.AppearanceRepository;
import com.autokereskedes.backend.repository.ModelRepository;
import com.autokereskedes.backend.repository.VariantRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;
@RestController
@RequestMapping("/api/appearance")
@CrossOrigin(origins = "http://localhost:3000")
public class AppearanceController {
    private final AppearanceRepository appearanceRepository;
    private final ModelRepository modelRepository;
    private final VariantRepository variantRepository;

    public AppearanceController(
            AppearanceRepository appearanceRepository,
            ModelRepository modelRepository,
            VariantRepository variantRepository
    ) {
        this.appearanceRepository = appearanceRepository;
        this.modelRepository = modelRepository;
        this.variantRepository = variantRepository;
    }
    @GetMapping("/{modelSlug}")
    public List<Appearance> getAppearancesByModelSlug(@PathVariable String modelSlug) {
        return modelRepository.findBySlugIgnoreCase(modelSlug)
                .map(appearanceRepository::findByModel)
                .orElse(Collections.emptyList());
    }
    @GetMapping("/id/{modelId}")
    public List<Appearance> getAppearancesByModelId(@PathVariable Long modelId) {
        return modelRepository.findById(modelId)
                .map(appearanceRepository::findByModel)
                .orElse(Collections.emptyList());
    }
    @GetMapping("/variant/{variantId}")
    public List<Appearance> getAppearancesByVariant(@PathVariable Long variantId) {
        return variantRepository.findById(variantId)
                .map(Variant::getModel)
                .map(appearanceRepository::findByModel)
                .orElse(Collections.emptyList());
    }
}
