package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Cart;
import com.autokereskedes.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
