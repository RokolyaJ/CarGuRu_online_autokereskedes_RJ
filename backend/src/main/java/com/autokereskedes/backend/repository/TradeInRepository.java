package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.TradeIn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TradeInRepository extends JpaRepository<TradeIn, Long> {
    List<TradeIn> findAllByUser_Id(Long userId);
}
