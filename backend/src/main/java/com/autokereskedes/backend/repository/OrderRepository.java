package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Order;
import com.autokereskedes.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
