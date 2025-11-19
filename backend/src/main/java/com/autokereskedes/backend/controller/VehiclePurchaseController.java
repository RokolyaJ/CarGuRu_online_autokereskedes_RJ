package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.PurchaseResponse;
import com.autokereskedes.backend.service.VehiclePurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
public class VehiclePurchaseController {

    private final VehiclePurchaseService service;

    public VehiclePurchaseController(VehiclePurchaseService service) {
        this.service = service;
    }

    @GetMapping("/{vin}")
    public ResponseEntity<PurchaseResponse> getByVin(@PathVariable String vin) {
        return service.findByVin(vin)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
