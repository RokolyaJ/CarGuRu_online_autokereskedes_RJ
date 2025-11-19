package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.UsedCarReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsedCarReservationRepository extends JpaRepository<UsedCarReservation, Long> {

    Optional<UsedCarReservation> findByUsedCarIdAndActiveTrue(Long usedCarId);

    List<UsedCarReservation> findByUserIdAndActiveTrue(Long userId);
}
