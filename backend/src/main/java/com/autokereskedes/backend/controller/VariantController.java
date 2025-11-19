package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.Brand;
import com.autokereskedes.backend.model.Engine;
import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Variant;
import com.autokereskedes.backend.model.StockVehicle;
import com.autokereskedes.backend.repository.BrandRepository;
import com.autokereskedes.backend.repository.ModelRepository;
import com.autokereskedes.backend.repository.VariantRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/variants")
@CrossOrigin(origins = "http://localhost:3000")
public class VariantController {

    private final VariantRepository variantRepository;
    private final ModelRepository modelRepository;
    private final BrandRepository brandRepository;
    private final ObjectMapper objectMapper;

    public VariantController(
            VariantRepository variantRepository,
            ModelRepository modelRepository,
            BrandRepository brandRepository,
            ObjectMapper objectMapper
    ) {
        this.variantRepository = variantRepository;
        this.modelRepository = modelRepository;
        this.brandRepository = brandRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/by-brand/{brandName}")
    public ResponseEntity<List<Map<String, Object>>> getVariantsByBrand(
            @PathVariable String brandName,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String fuel) {

        Optional<Brand> brandOpt = brandRepository.findByNameIgnoreCase(brandName);
        if (brandOpt.isEmpty()) return ResponseEntity.notFound().build();

        Brand brand = brandOpt.get();
        List<Model> brandModels = modelRepository.findByBrand(brand);
        if (brandModels.isEmpty()) return ResponseEntity.ok(Collections.emptyList());

        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Model model : brandModels) {
            if (category == null || (model.getCategory() != null &&
                    model.getCategory().equalsIgnoreCase(category))) {

                List<Variant> variants = variantRepository.findByModel(model);
                for (Variant v : variants) {
                    if (type != null && v.getCarType() != null &&
                            !v.getCarType().equalsIgnoreCase(type)) continue;

                    if (fuel != null) {
                        boolean matchesFuel = v.getEngines() != null &&
                                v.getEngines().stream()
                                        .anyMatch(e -> e.getFuelType() != null &&
                                                e.getFuelType().equalsIgnoreCase(fuel));
                        if (!matchesFuel) continue;
                    }

                    responseList.add(mapVariant(v));
                }
            }
        }

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/by-model/{modelName}")
    public ResponseEntity<List<Map<String, Object>>> getVariantsByModel(
            @PathVariable String modelName,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String fuel) {

        Optional<Model> modelOpt = modelRepository.findByNameIgnoreCase(modelName);
        if (modelOpt.isEmpty()) return ResponseEntity.notFound().build();

        Model model = modelOpt.get();

        if (category != null && model.getCategory() != null &&
                !model.getCategory().equalsIgnoreCase(category))
            return ResponseEntity.ok(Collections.emptyList());

        List<Variant> variants = variantRepository.findByModel(model);
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Variant v : variants) {
            if (type != null && v.getCarType() != null &&
                    !v.getCarType().equalsIgnoreCase(type)) continue;

            if (fuel != null) {
                boolean matchesFuel = v.getEngines() != null &&
                        v.getEngines().stream()
                                .anyMatch(e -> e.getFuelType() != null &&
                                        e.getFuelType().equalsIgnoreCase(fuel));
                if (!matchesFuel) continue;
            }

            responseList.add(mapVariant(v));
        }

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVariantById(@PathVariable Long id) {
        return variantRepository.findById(id)
                .map(this::mapVariant)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> mapVariant(Variant v) {
        Map<String, Object> map = new LinkedHashMap<>();

        map.put("id", v.getId());
        map.put("name", v.getName());
        map.put("price", v.getPrice());
        map.put("imageUrl", v.getImageUrl());
        map.put("power", v.getPower());
        map.put("drive", v.getDrive());
        map.put("range", v.getRange());
        map.put("carType", v.getCarType());

        map.put("brand", v.getModel() != null && v.getModel().getBrand() != null
                ? v.getModel().getBrand().getName() : null);
        map.put("model", v.getModel() != null ? v.getModel().getName() : null);

        map.put("exteriorDescription", v.getExteriorDescription());
        map.put("exteriorImageUrl", v.getExteriorImageUrl());
        map.put("exteriorImages", parseJsonList(v.getExteriorImages()));

        map.put("interiorDescription", v.getInteriorDescription());
        map.put("interiorImageUrl", v.getInteriorImageUrl());
        map.put("interiorImages", v.getInteriorImages());

        map.put("innovationDescription", v.getInnovationDescription());
        map.put("innovationImageUrl", v.getInnovationImageUrl());

        map.put("safetyDescription", v.getSafetyDescription());
        map.put("safetyImageUrl", v.getSafetyImageUrl());

        map.put("driverAssistanceDescription", v.getDriverAssistanceDescription());
        map.put("driverAssistanceImageUrl", v.getDriverAssistanceImageUrl());
        map.put("matrixLightDescription", v.getMatrixLightDescription());
        map.put("matrixLightImageUrl", v.getMatrixLightImageUrl());
        map.put("safeAssistanceDescription", v.getSafeAssistanceDescription());
        map.put("safeAssistanceImageUrl", v.getSafeAssistanceImageUrl());
        map.put("parkingAssistanceDescription", v.getParkingAssistanceDescription());
        map.put("parkingAssistanceImageUrl", v.getParkingAssistanceImageUrl());

        Set<String> fuels = new LinkedHashSet<>();
        if (v.getEngines() != null) {
            for (Engine e : v.getEngines()) {
                if (e.getFuelType() != null && !e.getFuelType().isBlank()) {
                    fuels.add(e.getFuelType());
                }
            }
        }
        map.put("fuels", new ArrayList<>(fuels));

        map.put("colorGalleries", parseColorGalleries(v.getColorGalleries()));

        map.put("sizeImageUrl", v.getSizeImageUrl());

        map.put("technologyImages", parseJsonList(v.getTechnologyImages()));
        map.put("technologyDescriptions", parseJsonList(v.getTechnologyDescriptions()));

        List<String> availableVins = v.getStockVehicles() != null
                ? v.getStockVehicles().stream()
                .filter(stock -> "AVAILABLE".equalsIgnoreCase(stock.getStatus()))
                .map(StockVehicle::getVin)
                .filter(Objects::nonNull)
                .collect(Collectors.toList())
                : Collections.emptyList();

        map.put("availableVins", availableVins);
        map.put("fuel", v.getFuel());
        map.put("transmission", v.getTransmission());
        map.put("color", v.getColor());
        map.put("plateNumber", v.getPlateNumber());
        map.put("decoration", v.getDecoration());

        return map;
    }

    private Map<String, List<String>> parseColorGalleries(String json) {
        if (json == null || json.isBlank()) return Collections.emptyMap();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, List<String>>>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
