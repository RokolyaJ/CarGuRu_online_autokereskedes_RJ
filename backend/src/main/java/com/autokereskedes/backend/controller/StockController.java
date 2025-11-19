package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.VariantDto;
import com.autokereskedes.backend.model.Stock;
import com.autokereskedes.backend.model.StockVehicle;
import com.autokereskedes.backend.model.Variant;
import com.autokereskedes.backend.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableByModel(@RequestParam String model) {
        List<Stock> stocks = stockService.getAvailableByModel(model);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Stock s : stocks) {
            if (s.getQuantity() > 0 && s.getStore() != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", s.getId());
                map.put("storeName", s.getStore().getStoreName());
                map.put("city", s.getStore().getCity());
                map.put("quantity", s.getQuantity());
                result.add(map);
            }
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/decrease")
    public ResponseEntity<String> decreaseStock(@RequestParam Long stockId) {
        boolean success = stockService.decreaseStock(stockId);
        if (success) {
            return ResponseEntity.ok("A készlet sikeresen csökkent.");
        } else {
            return ResponseEntity.badRequest().body("Nincs elérhető készlet, vagy érvénytelen készletazonosító.");
        }
    }
    @GetMapping("/stores")
    public ResponseEntity<List<Map<String, Object>>> getAllStores() {
        var stores = stockService.getAllStores();

        List<Map<String, Object>> result = new ArrayList<>();
        for (var s : stores) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("storeName", s.getStoreName());
            map.put("city", s.getCity());
            map.put("address", s.getAddress());
            map.put("phone", s.getPhone());
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }


    @GetMapping("/available-by-variant/{variantId}")
    public ResponseEntity<List<Map<String, Object>>> getStoresByVariant(@PathVariable Long variantId) {
        List<StockVehicle> stockVehicles = stockService.getAllStockVehicles();

        Map<String, Integer> storeQuantities = new HashMap<>();
        Map<String, String> storeCities = new HashMap<>();

        for (StockVehicle sv : stockVehicles) {
            if (sv.getVariant() != null
                    && sv.getVariant().getId().equals(variantId)
                    && "AVAILABLE".equalsIgnoreCase(sv.getStatus())
                    && sv.getQuantity() != null && sv.getQuantity() > 0) {

                String storeName = sv.getStoreName();
                String city = sv.getCity();

                storeQuantities.put(storeName, storeQuantities.getOrDefault(storeName, 0) + sv.getQuantity());
                storeCities.put(storeName, city);
            }
        }

        List<Map<String, Object>> result = storeQuantities.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("storeName", e.getKey());
                    map.put("city", storeCities.get(e.getKey()));
                    map.put("quantity", e.getValue());
                    return map;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping("/decrease-by-variant/{variantId}")
    public ResponseEntity<String> decreaseByVariant(@PathVariable Long variantId) {
        Optional<StockVehicle> opt = stockService.findFirstAvailableByVariant(variantId);

        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body("Ehhez a változathoz nem található elérhető jármű.");
        }

        StockVehicle vehicle = opt.get();
        if (vehicle.getQuantity() > 1) {
            vehicle.setQuantity(vehicle.getQuantity() - 1);
        } else {
            vehicle.setStatus("SOLD");
        }

        stockService.saveStockVehicle(vehicle);
        return ResponseEntity.ok("A készlet csökkent ennél a változatnál." + variantId);
    }

@GetMapping("/variants/by-store/{storeId}")
public ResponseEntity<List<Map<String, Object>>> getVariantsByStore(@PathVariable Long storeId) {
    List<Stock> stocks = stockService.getStocksByStoreId(storeId);
    Set<Long> modelIds = new HashSet<>();
    for (Stock s : stocks) {
        if (s.getModel() != null) {
            modelIds.add(s.getModel().getId());
        }
    }

    List<Map<String, Object>> variants = new ArrayList<>();
    for (Long modelId : modelIds) {
        var foundVariants = stockService.getVariantsByModelId(modelId);
        for (var v : foundVariants) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("name", v.getName());
            map.put("fuel", v.getFuel());
            map.put("price", v.getPrice());
            map.put("power", v.getPower());
            map.put("transmission", v.getTransmission());
            map.put("color", v.getColor());
            map.put("plateNumber", v.getPlateNumber());
            map.put("decoration", v.getDecoration());
            map.put("imageUrl", v.getImageUrl());
            variants.add(map);
        }
    }

    return ResponseEntity.ok(variants);
}

@GetMapping("/variants/by-store/{storeId}/brand/{brandName}")
public ResponseEntity<List<Map<String, Object>>> getVariantsByStoreAndBrand(
        @PathVariable Long storeId,
        @PathVariable String brandName
) {
    var foundVariants = stockService.getVariantsByStoreAndBrand(storeId, brandName);

    List<Map<String, Object>> variants = new ArrayList<>();
    for (var v : foundVariants) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", v.getId());
        map.put("name", v.getName());
        map.put("fuel", v.getFuel());
        map.put("price", v.getPrice());
        map.put("power", v.getPower());
        map.put("transmission", v.getTransmission());
        map.put("color", v.getColor());
        map.put("plateNumber", v.getPlateNumber());
        map.put("decoration", v.getDecoration());
        map.put("imageUrl", v.getImageUrl());
        variants.add(map);
    }

    return ResponseEntity.ok(variants);
}
@GetMapping("/stores/by-brand/{brandName}")
public ResponseEntity<List<Map<String, Object>>> getStoresByBrand(@PathVariable String brandName) {
    var stockVehicles = stockService.getAllStockVehicles();

    Map<String, Map<String, Object>> distinct = new LinkedHashMap<>();

    for (StockVehicle sv : stockVehicles) {
        if (sv.getBrandName() != null &&
            sv.getBrandName().equalsIgnoreCase(brandName) &&
            "AVAILABLE".equalsIgnoreCase(sv.getStatus()) &&
            (sv.getQuantity() == null || sv.getQuantity() > 0) &&
            sv.getStoreName() != null) {

            String city = sv.getCity() == null ? "" : sv.getCity();
            String key = (sv.getStoreName() + "|" + city).toLowerCase();

            if (!distinct.containsKey(key)) {
                Map<String, Object> m = new HashMap<>();
                m.put("id", key.hashCode());
                m.put("storeName", sv.getStoreName());
                m.put("city", city.isBlank() ? null : city);
                distinct.put(key, m);
            }
        }
    }
    return ResponseEntity.ok(new ArrayList<>(distinct.values()));
}

@GetMapping("/models/by-store")
public ResponseEntity<List<Map<String, Object>>> getModelsByStore(
        @RequestParam String storeName,
        @RequestParam(required = false) String city
) {
    var stockVehicles = stockService.getAllStockVehicles();

    Set<String> uniqueModels = new HashSet<>();
    List<Map<String, Object>> result = new ArrayList<>();

    for (StockVehicle sv : stockVehicles) {
        if (sv.getStoreName() != null &&
            sv.getStoreName().equalsIgnoreCase(storeName) &&
            (city == null || sv.getCity() != null && sv.getCity().equalsIgnoreCase(city)) &&
            sv.getStatus().equalsIgnoreCase("AVAILABLE") &&
            (sv.getQuantity() == null || sv.getQuantity() > 0)) {

            if (!uniqueModels.contains(sv.getModelName())) {
                Map<String, Object> map = new HashMap<>();
                map.put("modelName", sv.getModelName());
                map.put("brandName", sv.getBrandName());
                map.put("imageFrontUrl", sv.getImageFrontUrl());
                map.put("powerHp", sv.getPowerHp());
                result.add(map);
                uniqueModels.add(sv.getModelName());
            }
        }
    }
    return ResponseEntity.ok(result);
}

@GetMapping("/by-brand/{brandName}")
public ResponseEntity<List<Map<String, Object>>> getStockByBrand(@PathVariable String brandName) {
    var vehicles = stockService.getAllStockVehicles();

    List<Map<String, Object>> result = new ArrayList<>();

    for (StockVehicle v : vehicles) {
        if (v.getBrandName().equalsIgnoreCase(brandName)) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("name", v.getModelName());
            map.put("fuel", v.getFuelType());
            map.put("power", v.getPowerHp());
            map.put("price", v.getPriceHuf());
            map.put("imageUrl", v.getImageFrontUrl());
            map.put("storeName", v.getStoreName());
            map.put("city", v.getCity());
            result.add(map);
        }
    }
    return ResponseEntity.ok(result);
}
@GetMapping("/models/by-brand/{brandName}")
public ResponseEntity<List<Map<String, Object>>> getModelsByBrand(@PathVariable String brandName) {
    var vehicles = stockService.getAllStockVehicles();

    Map<String, Map<String, Object>> result = new LinkedHashMap<>();

    for (StockVehicle v : vehicles) {
        if (v.getBrandName().equalsIgnoreCase(brandName)) {
            String model = v.getModelName();
            if (!result.containsKey(model)) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", model);
                map.put("fuel", v.getFuelType());
                map.put("power", v.getPowerHp());
                map.put("price", v.getPriceHuf());
                map.put("imageUrl", v.getImageFrontUrl());
                result.put(model, map);
            }
        }
    }
    return ResponseEntity.ok(new ArrayList<>(result.values()));
}
@GetMapping("/variants/by-brand/{brandName}")
public ResponseEntity<List<Map<String, Object>>> getVariantsByBrand(@PathVariable String brandName) {
    var stockVehicles = stockService.getAllStockVehicles();

    List<Map<String, Object>> result = new ArrayList<>();
    Set<String> seen = new HashSet<>();

    for (StockVehicle v : stockVehicles) {
        if (v.getBrandName() != null && v.getBrandName().equalsIgnoreCase(brandName)) {

            if (!seen.add(v.getModelName())) continue;

            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("name", v.getModelName());
            map.put("fuel", v.getFuelType());
            map.put("power", v.getPowerHp());
            map.put("price", v.getPriceHuf());
            map.put("imageUrl", v.getImageFrontUrl());
            result.add(map);
        }
    }

    return ResponseEntity.ok(result);
}
@GetMapping("/full-variants/by-brand/{brandName}")
public ResponseEntity<List<Map<String, Object>>> getFullVariantDetailsByBrand(@PathVariable String brandName) {
    var vehicles = stockService.getAllStockVehicles();

    List<Map<String, Object>> result = new ArrayList<>();
    Set<String> seen = new HashSet<>();

    for (StockVehicle v : vehicles) {
        if (v.getBrandName() != null && v.getBrandName().equalsIgnoreCase(brandName)) {

            String key = v.getModelName() + "|" + (v.getVariant() != null ? v.getVariant().getId() : v.getId());
            if (!seen.add(key)) continue;

            Variant variant = v.getVariant(); 

            Map<String, Object> map = new HashMap<>();
            map.put("id", v.getId());
            map.put("model", v.getModelName());
            map.put("variant", variant != null ? variant.getName() : null);

            map.put("fuel", variant != null && variant.getFuel() != null ? variant.getFuel() : v.getFuelType());
            map.put("powerHp", variant != null && variant.getPower() != null ? variant.getPower() : v.getPowerHp());
            map.put("transmission", variant != null && variant.getTransmission() != null ? variant.getTransmission() : v.getTransmission());

            map.put("imageUrl", variant != null && variant.getImageUrl() != null ? variant.getImageUrl() : v.getImageFrontUrl());

            map.put("engineL", v.getEngineL());
            map.put("drive", v.getDrivetrain());
            map.put("price", v.getPriceHuf());
            map.put("color", v.getExtColor());
            map.put("year", v.getYear());
            map.put("doors", v.getDoors());
            map.put("seats", v.getSeats());
            map.put("vin", v.getVin());
            map.put("storeName", v.getStoreName());
            map.put("city", v.getCity());
            result.add(map);
        }
    }

    return ResponseEntity.ok(result);
}




}
