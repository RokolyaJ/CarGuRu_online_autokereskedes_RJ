package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.service.*;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insurance")
@CrossOrigin(origins = "*")
public class InsuranceController {

    private final InsuranceService insuranceService;
    private final OrderService orderService;

    public InsuranceController(InsuranceService insuranceService, OrderService orderService) {
        this.insuranceService = insuranceService;
        this.orderService = orderService;
    }

    @PostMapping("/create")
public ResponseEntity<?> createInsurance(
        @RequestParam(required = false) Long orderId,
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Long carId,
        @RequestParam String provider,
        @RequestParam String type,
        @RequestParam Integer durationMonths,
        @RequestParam String bonusClass,
        @RequestParam Double priceHuf
) {
    Order order = null;
    if (orderId != null) {
        order = orderService.getOrderById(orderId).orElse(null);
    }

    Insurance insurance = insuranceService.createInsurance(order, userId, carId, provider, type, durationMonths, bonusClass, priceHuf);

    return ResponseEntity.ok(Map.of(
            "message", "Biztosítási adatok elmentve: " + provider,
            "insuranceId", insurance.getId()
    ));
}
}