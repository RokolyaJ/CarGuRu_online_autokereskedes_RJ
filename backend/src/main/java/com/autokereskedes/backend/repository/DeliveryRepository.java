package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
}
