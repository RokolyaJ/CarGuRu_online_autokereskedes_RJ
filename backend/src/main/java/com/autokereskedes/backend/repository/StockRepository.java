package com.autokereskedes.backend.repository;

import com.autokereskedes.backend.model.Stock;
import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByModel(Model model);
    List<Stock> findByModelIn(List<Model> models);
    List<Stock> findByStore(Store store);
    List<Stock> findByStore_Id(Long storeId);

}

