package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/create")
    public Order createOrder(@RequestBody Order orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    @GetMapping("/{id}")
    public Optional<Order> getOrder(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping("/purchase-with-balance")
    public Order purchaseWithBalance(@RequestParam Long userId,
                                     @RequestParam Long carId,
                                     @RequestParam Long totalPrice) {
        return orderService.purchaseWithBalance(userId, carId, totalPrice);
    }

    @GetMapping("/get-by-user")
    public List<Order> getOrdersByUser(@RequestParam Long userId) {
        return orderService.getOrdersByUser(userId);
    }
}
