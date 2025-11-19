package com.autokereskedes.backend.dto;

import lombok.Data;

@Data
public class UsedCarAdminDto {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private String fuel;
    private Integer price;
    private String imageUrl;

    public UsedCarAdminDto(Long id, String brand, String model, Integer year,
                           String fuel, Integer price, String imageUrl) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.fuel = fuel;
        this.price = price;
        this.imageUrl = imageUrl;
    }
}
