package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.StockVehicle;
import com.autokereskedes.backend.service.StockVehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stock-vehicle")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class StockVehicleController {

    private final StockVehicleService stockVehicleService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAvailableVehicles() {
        List<Map<String, Object>> response = stockVehicleService.getAllAvailableVehicles()
                .stream()
                .map(stockVehicleService::mapVehicle)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{vin}")
    public ResponseEntity<Map<String, Object>> getVehicleByVin(@PathVariable String vin) {
        StockVehicle v = stockVehicleService.getByVin(vin);
        return ResponseEntity.ok(stockVehicleService.mapVehicle(v));
    }

    @PutMapping("/{vin}/purchase")
    public ResponseEntity<String> markVehicleAsSold(@PathVariable String vin) {
        stockVehicleService.markAsSold(vin);
        return ResponseEntity.ok("A jármű sikeresen el lett adva (VIN: " + vin + ")");
    }

    @PostMapping("/decrease")
    public ResponseEntity<String> decreaseStock(@RequestParam Long stockId) {
        stockVehicleService.decreaseStock(stockId);
        return ResponseEntity.ok("Készlet csökkentve");
    }

    @GetMapping("/available")
public ResponseEntity<List<Map<String, Object>>> getAvailableStores(@RequestParam String model) {
    List<StockVehicle> list = stockVehicleService.getAvailableStoresByModel(model);

    Map<String, Map<String, Object>> groupedStores = new LinkedHashMap<>();

    for (StockVehicle v : list) {
        String key = v.getStoreName() != null ? v.getStoreName() : "Ismeretlen üzlet";

        if (groupedStores.containsKey(key)) {
            int newQty = ((int) groupedStores.get(key).get("quantity")) + (v.getQuantity() != null ? v.getQuantity() : 0);
            groupedStores.get(key).put("quantity", newQty);
        } else {
            Map<String, Object> m = new HashMap<>();
            m.put("storeName", key);
            m.put("city", (v.getCity() != null && !v.getCity().isEmpty()) ? v.getCity() : "Nincs város megadva");
            m.put("brand", v.getBrandName());
            m.put("model", v.getModelName());
            m.put("quantity", v.getQuantity() != null ? v.getQuantity() : 0);
            m.put("priceHuf", v.getPriceHuf());
            groupedStores.put(key, m);
        }
    }

    List<Map<String, Object>> result = new ArrayList<>(groupedStores.values());
    return ResponseEntity.ok(result);
}



    @PostMapping("/seed")
    public ResponseEntity<String> seedTestVehicle() {
        stockVehicleService.seedTestVehicle();
        return ResponseEntity.ok("Teszt autó sikeresen hozzáadva (VIN: WAUZZZ111234567890)");
    }
}
