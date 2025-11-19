package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.StockVehicle;
import com.autokereskedes.backend.repository.StockVehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StockVehicleService {

    private final StockVehicleRepository stockVehicleRepository;

    public List<StockVehicle> getAllAvailableVehicles() {
        return stockVehicleRepository.findByStatus("AVAILABLE");
    }

    public List<StockVehicle> getAvailableStoresByModel(String modelName) {
        return stockVehicleRepository.findByModelNameContainingIgnoreCaseAndQuantityGreaterThan(modelName, 0);
    }

    public StockVehicle getByVin(String vin) {
        return stockVehicleRepository.findByVinIgnoreCase(vin)
                .orElseThrow(() -> new RuntimeException("Nincs ilyen jármű (VIN: " + vin + ")"));
    }

    public StockVehicle markAsSold(String vin) {
        StockVehicle vehicle = getByVin(vin);
        if ("SOLD".equalsIgnoreCase(vehicle.getStatus())) {
            throw new RuntimeException("Ez a jármű már el lett adva!");
        }

        if (vehicle.getQuantity() != null && vehicle.getQuantity() > 0) {
            vehicle.setQuantity(vehicle.getQuantity() - 1);
        }

        if (vehicle.getQuantity() != null && vehicle.getQuantity() <= 0) {
            vehicle.setStatus("SOLD");
        }

        vehicle.setUpdatedAt(LocalDateTime.now());
        return stockVehicleRepository.save(vehicle);
    }

    public void decreaseStock(Long stockId) {
        StockVehicle stock = stockVehicleRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Nincs ilyen raktári autó"));
        if (stock.getQuantity() <= 0) throw new RuntimeException("Nincs készleten!");
        stock.setQuantity(stock.getQuantity() - 1);

        if (stock.getQuantity() <= 0) {
            stock.setStatus("SOLD");
        }

        stock.setUpdatedAt(LocalDateTime.now());
        stockVehicleRepository.save(stock);
    }

    public void seedTestVehicle() {
        stockVehicleRepository.findByVinIgnoreCase("WAUZZZ111234567890")
                .ifPresentOrElse(
                        v -> System.out.println("⚠️ Teszt autó már létezik."),
                        () -> {
                            StockVehicle vehicle = StockVehicle.builder()
                                    .brandName("Audi")
                                    .modelName("A4")
                                    .vin("WAUZZZ111234567890")
                                    .fuelType("Benzin")
                                    .powerKw(110)
                                    .powerHp(150)
                                    .engineL(1.4)
                                    .transmission("Automata")
                                    .drivetrain("Elsőkerék")
                                    .extColor("Fekete")
                                    .intColor("Világos bőr")
                                    .year(2022)
                                    .doors(4)
                                    .seats(5)
                                    .priceHuf(12499000L)
                                    .storeName("Linartech Budapest")
                                    .city("Budapest")
                                    .quantity(1)
                                    .status("AVAILABLE")
                                    .imageFrontUrl("https://cdn.pixabay.com/photo/2016/11/29/05/08/audi-1868741_1280.jpg")
                                    .imageSideUrl("https://cdn.pixabay.com/photo/2016/11/29/05/08/audi-1868742_1280.jpg")
                                    .imageInteriorUrl("https://cdn.pixabay.com/photo/2017/03/09/12/31/audi-2120660_1280.jpg")
                                    .build();
                            stockVehicleRepository.save(vehicle);
                            System.out.println("Teszt autó hozzáadva: WAUZZZ111234567890");
                        }
                );
    }

    public Map<String, Object> mapVehicle(StockVehicle v) {
        Map<String, Object> map = new LinkedHashMap<>();

        map.put("id", v.getId());
        map.put("brand", v.getBrandName());
        map.put("model", v.getModelName());
        map.put("vin", v.getVin());
        map.put("fuelType", v.getFuelType());
        map.put("powerKw", v.getPowerKw());
        map.put("powerHp", v.getPowerHp());
        map.put("engineL", v.getEngineL());
        map.put("transmission", v.getTransmission());
        map.put("gears", v.getGears());
        map.put("drivetrain", v.getDrivetrain());
        map.put("consumptionL", v.getConsumptionL());
        map.put("co2Gkm", v.getCo2Gkm());
        map.put("extColor", v.getExtColor());
        map.put("intColor", v.getIntColor());
        map.put("year", v.getYear());
        map.put("doors", v.getDoors());
        map.put("seats", v.getSeats());
        map.put("priceHuf", v.getPriceHuf());
        map.put("location", v.getLocation());
        map.put("storeName", v.getStoreName());
        map.put("city", v.getCity());
        map.put("quantity", v.getQuantity());
        map.put("modelCode", v.getModelCode());
        map.put("vatReclaimable", v.getVatReclaimable());
        map.put("status", v.getStatus());
        map.put("imageFrontUrl", v.getImageFrontUrl());
        map.put("imageSideUrl", v.getImageSideUrl());
        map.put("imageBackUrl", v.getImageBackUrl());
        map.put("imageInteriorUrl", v.getImageInteriorUrl());
        map.put("modelId", v.getModel() != null ? v.getModel().getId() : null);

        return map;
    }
}
