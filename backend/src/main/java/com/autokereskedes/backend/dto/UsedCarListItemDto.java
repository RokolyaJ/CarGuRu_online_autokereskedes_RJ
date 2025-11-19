package com.autokereskedes.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsedCarListItemDto {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private Integer mileage;
    private Integer price;
    private String fuel;
    private String body;
    private String imageUrl;
    private boolean reserved;

}
