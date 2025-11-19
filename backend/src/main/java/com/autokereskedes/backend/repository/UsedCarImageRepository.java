package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.UsedCarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface UsedCarImageRepository extends JpaRepository<UsedCarImage, Long> {

    List<UsedCarImage> findByCarIdOrderBySortOrderAsc(Long carId);
    List<UsedCarImage> findByTempId(String tempId);
     @Modifying
    @Query("UPDATE UsedCarImage i SET i.cover = false WHERE i.carId = :carId")
    void clearCoverForCar(@Param("carId") Long carId);
}
