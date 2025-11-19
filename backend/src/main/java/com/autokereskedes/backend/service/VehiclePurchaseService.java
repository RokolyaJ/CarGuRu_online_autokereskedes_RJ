package com.autokereskedes.backend.service;

import com.autokereskedes.backend.dto.PurchaseResponse;
import com.autokereskedes.backend.model.VehiclePurchase;
import com.autokereskedes.backend.repository.VehiclePurchaseRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VehiclePurchaseService {

    private final VehiclePurchaseRepository repository;

    public VehiclePurchaseService(VehiclePurchaseRepository repository) {
        this.repository = repository;
    }

    public Optional<PurchaseResponse> findByVin(String vin) {
        return repository.findByVin(vin.trim().toUpperCase()).map(purchase -> {
            PurchaseResponse dto = new PurchaseResponse();
            dto.setVin(purchase.getVin());
            dto.setBrand(purchase.getBrand());
            dto.setModel(purchase.getModel());
            dto.setVariant(purchase.getVariant());
            dto.setEngine(purchase.getEngine());
            dto.setColor(purchase.getColor());
            dto.setEquipments(purchase.getEquipments());
            dto.setDealership(purchase.getDealership());
            dto.setPrice(purchase.getPrice());
            dto.setPurchaseDate(purchase.getPurchaseDate());

            if (purchase.getUser() != null) {
                dto.setBuyerName(
                        purchase.getUser().getFirstName() + " " + purchase.getUser().getLastName()
                );
            }
            return dto;
        });
    }
}
