package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.UsedCar;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsedCarRepository extends JpaRepository<UsedCar, Long>, JpaSpecificationExecutor<UsedCar> {

    @Query(value = "SELECT DISTINCT brand FROM usedcars WHERE brand IS NOT NULL ORDER BY brand", nativeQuery = true)
    List<String> distinctBrands();

    @Query(value = "SELECT DISTINCT model FROM usedcars WHERE brand = :brand AND model IS NOT NULL ORDER BY model", nativeQuery = true)
    List<String> distinctModels(@Param("brand") String brand);

    @Query(value = "SELECT DISTINCT body_type FROM usedcars WHERE body_type IS NOT NULL ORDER BY body_type", nativeQuery = true)
    List<String> distinctBodies();

    @Query(value = "SELECT DISTINCT fuel FROM usedcars WHERE fuel IS NOT NULL ORDER BY fuel", nativeQuery = true)
    List<String> distinctFuels();

    @Query(value = "SELECT DISTINCT condition FROM usedcars WHERE condition IS NOT NULL ORDER BY condition", nativeQuery = true)
    List<String> distinctConditions();

    @Query(value = "SELECT DISTINCT doors FROM usedcars WHERE doors IS NOT NULL ORDER BY doors", nativeQuery = true)
    List<Integer> distinctDoors();

    @Query(value = "SELECT DISTINCT seats FROM usedcars WHERE seats IS NOT NULL ORDER BY seats", nativeQuery = true)
    List<Integer> distinctSeats();

    // Képek
    @Query(value = """
            SELECT i.image
            FROM usedcar_images i
            WHERE i.car_id = :carId
            ORDER BY i.id
            """, nativeQuery = true)
    List<String> imagesFor(@Param("carId") Long carId);

    @Query(value = """
            SELECT i.image
            FROM usedcar_images i
            WHERE i.car_id = :carId
            ORDER BY i.id
            LIMIT 1
            """, nativeQuery = true)
    String firstImageFor(@Param("carId") Long carId);
   List<UsedCar> findByOwner_Id(Long ownerId);

}
