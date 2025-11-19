package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.repository.InsuranceRepository;
import org.springframework.stereotype.Service;

@Service
public class InsuranceService {

    private final InsuranceRepository insuranceRepository;

    public InsuranceService(InsuranceRepository insuranceRepository) {
        this.insuranceRepository = insuranceRepository;
    }

    public Insurance createInsurance(
        Order order,
        Long userId,
        Long carId,
        String provider,
        String type,
        Integer durationMonths,
        String bonusClass,
        Double priceHuf
) {
    Insurance insurance = new Insurance();

    if (order != null) {
        insurance.setOrder(order);
        insurance.setCarId(order.getCarId());
        if (order.getUser() != null) {
            insurance.setUserId(order.getUser().getId());
        } else {
            insurance.setUserId(userId); 
        }
    } 
    else {
        insurance.setUserId(userId);
        insurance.setCarId(carId);
    }

    insurance.setProvider(provider);
    insurance.setType(type);
    insurance.setDurationMonths(durationMonths);
    insurance.setBonusClass(bonusClass);
    insurance.setPriceHuf(priceHuf);

    return insuranceRepository.save(insurance);
}
}
