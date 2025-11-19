package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.CartDtos.*;
import com.autokereskedes.backend.model.Cart;
import com.autokereskedes.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService service;
    public CartController(CartService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<CartResponse> myCart(Authentication auth) {
        Cart c = service.getOrCreateCartFor(auth.getName());
        return ResponseEntity.ok(service.toResponse(c));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(Authentication auth, @RequestBody AddItemRequest req) {
        Cart c = service.addItem(auth.getName(), req);
        return ResponseEntity.ok(service.toResponse(c));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeItem(Authentication auth, @PathVariable Long id) {
        service.removeItem(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
