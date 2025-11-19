package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final OrderService orderService;

    public DeliveryController(DeliveryService deliveryService, OrderService orderService) {
        this.deliveryService = deliveryService;
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createDelivery(
            @RequestParam Long orderId,
            @RequestParam DeliveryType type,
            @RequestParam(required = false) String addressLine,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String zip,
            @RequestParam String dateTime
    ) {
        Order order = orderService.getOrderById(orderId)
                .orElseThrow(() -> new RuntimeException("Rendelés nem található!"));

        OffsetDateTime scheduledAt = OffsetDateTime.parse(dateTime);
        Delivery delivery = deliveryService.createDelivery(order, type, addressLine, city, zip, scheduledAt);

        Map<String, Object> response = new HashMap<>();
        response.put("id", delivery.getId());
        response.put("feeHuf", delivery.getFeeHuf());
        response.put("type", delivery.getType());
        response.put("scheduledAt", delivery.getScheduledAt());
        response.put("addressCity", delivery.getAddressCity());
        response.put("addressLine", delivery.getAddressLine());
        response.put("addressZip", delivery.getAddressZip());
        return ResponseEntity.ok(response);
    }
}
