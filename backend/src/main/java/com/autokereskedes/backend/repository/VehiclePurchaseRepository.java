package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.VehiclePurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface VehiclePurchaseRepository extends JpaRepository<VehiclePurchase, UUID> {

    @Query("SELECT v FROM VehiclePurchase v WHERE UPPER(v.vin) = UPPER(:vin)")
    Optional<VehiclePurchase> findByVin(@Param("vin") String vin);
}
