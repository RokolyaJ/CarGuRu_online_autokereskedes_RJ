package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.Model;
import com.autokereskedes.backend.model.Stock;
import com.autokereskedes.backend.model.StockVehicle;
import com.autokereskedes.backend.model.Store;
import com.autokereskedes.backend.model.Variant;
import com.autokereskedes.backend.repository.ModelRepository;
import com.autokereskedes.backend.repository.StockRepository;
import com.autokereskedes.backend.repository.StockVehicleRepository;
import com.autokereskedes.backend.repository.StoreRepository;
import com.autokereskedes.backend.repository.VariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final StoreRepository storeRepository;
    private final ModelRepository modelRepository;
    private final StockVehicleRepository stockVehicleRepository;
    private final VariantRepository variantRepository; 

    public StockService(
            StockRepository stockRepository,
            StoreRepository storeRepository,
            ModelRepository modelRepository,
            StockVehicleRepository stockVehicleRepository,
            VariantRepository variantRepository
    ) {
        this.stockRepository = stockRepository;
        this.storeRepository = storeRepository;
        this.modelRepository = modelRepository;
        this.stockVehicleRepository = stockVehicleRepository;
        this.variantRepository = variantRepository; 
    }

    public List<Stock> getAvailableByModel(String modelName) {
        Model model = modelRepository.findByNameIgnoreCase(modelName)
                .orElseGet(() -> modelRepository.findBySlugIgnoreCase(modelName).orElse(null));

        if (model == null) return List.of();
        return stockRepository.findByModel(model);
    }

    @Transactional
    public boolean decreaseStock(Long stockId) {
        Optional<Stock> stockOpt = stockRepository.findById(stockId);
        if (stockOpt.isEmpty()) return false;

        Stock stock = stockOpt.get();
        if (stock.getQuantity() > 0) {
            stock.setQuantity(stock.getQuantity() - 1);
            stockRepository.save(stock);
            return true;
        }
        return false;
    }

    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }
    public List<StockVehicle> getAllStockVehicles() {
        return stockVehicleRepository.findAll();
    }

    public Optional<StockVehicle> findFirstAvailableByVariant(Long variantId) {
        return stockVehicleRepository.findFirstByVariantIdAndStatus(variantId, "AVAILABLE");
    }
    public void saveStockVehicle(StockVehicle vehicle) {
        stockVehicleRepository.save(vehicle);
    }
    public List<Stock> getStocksByStoreId(Long storeId) {
        return stockRepository.findByStore_Id(storeId);
    }

    public List<Variant> getVariantsByModelId(Long modelId) {
        Model model = new Model();
        model.setId(modelId);
        return variantRepository.findByModel(model);
    }
public List<Variant> getVariantsByStoreAndBrand(Long storeId, String brandName) {
    List<Stock> stocks = stockRepository.findByStore_Id(storeId);
    return stocks.stream()
            .filter(stock ->
                    stock.getModel() != null &&
                    stock.getModel().getBrand() != null &&
                    stock.getModel().getBrand().getName().equalsIgnoreCase(brandName)
            )
            .flatMap(stock -> variantRepository.findByModel(stock.getModel()).stream())
            .distinct()
            .toList();
}

}
