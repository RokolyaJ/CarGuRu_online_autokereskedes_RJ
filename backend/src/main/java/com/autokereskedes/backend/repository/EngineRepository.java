package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Engine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EngineRepository extends JpaRepository<Engine, Long> {

    @Query("""
        SELECT DISTINCT e.name
        FROM Engine e
        WHERE e.variant.model.name = :model
        AND e.variant.model.brand.name = :brand
        ORDER BY e.name
    """)
    List<String> findEngineNames(@Param("brand") String brand,
                                 @Param("model") String model);

    @Query("""
        SELECT e
        FROM Engine e
        WHERE e.variant.model.name = :model
        AND e.variant.model.brand.name = :brand
        ORDER BY e.name
    """)
    List<Engine> findByBrandAndModel(@Param("brand") String brand,
                                     @Param("model") String model);
}
