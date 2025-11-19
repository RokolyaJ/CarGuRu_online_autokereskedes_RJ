package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.StockVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StockVehicleRepository extends JpaRepository<StockVehicle, Long> {

    Optional<StockVehicle> findByVin(String vin);

    Optional<StockVehicle> findByVinIgnoreCase(String vin);

    List<StockVehicle> findByStatus(String status);

    List<StockVehicle> findByModelNameAndQuantityGreaterThan(String modelName, int minQuantity);

    List<StockVehicle> findByModelNameContainingIgnoreCaseAndQuantityGreaterThan(String modelName, int minQuantity);
List<StockVehicle> findByVariantIdAndStatus(Long variantId, String status);

Optional<StockVehicle> findFirstByVariantIdAndStatus(Long variantId, String status);

}
