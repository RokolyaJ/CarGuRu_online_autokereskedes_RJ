package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.UsedCarFeatures;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsedCarFeaturesRepository extends JpaRepository<UsedCarFeatures, Long> {
    Optional<UsedCarFeatures> findByCar_Id(Long carId);
}
