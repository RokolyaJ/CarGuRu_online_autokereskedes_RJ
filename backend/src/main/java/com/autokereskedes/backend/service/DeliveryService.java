package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    public Delivery createDelivery(Order order, DeliveryType type, String addressLine, String city, String zip, OffsetDateTime time) {
        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setType(type);
        delivery.setScheduledAt(time);
        delivery.setAddressLine(addressLine);
        delivery.setAddressCity(city);
        delivery.setAddressZip(zip);

        long fee = (type == DeliveryType.HOME_DELIVERY) ? 35000 : 0;
        delivery.setFeeHuf(fee);

        return deliveryRepository.save(delivery);
    }
}
