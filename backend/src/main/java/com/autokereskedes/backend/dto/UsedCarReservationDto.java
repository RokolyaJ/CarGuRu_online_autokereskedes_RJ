package com.autokereskedes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsedCarReservationDto {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private Integer mileage;
    private Integer price;
    private String fuel;
    private String bodyType;
    private String imageUrl;
    private boolean reserved;
}
