package com.autokereskedes.backend.dto;

public class UsedCarSearchDto {

    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private Integer price;
    private Integer mileage;
    private String fuel;
    private String body;
    private String imageUrl;

    private boolean reserved;
    private Long reservedById;

    public UsedCarSearchDto(
            Long id,
            String brand,
            String model,
            Integer year,
            Integer price,
            Integer mileage,
            String fuel,
            String body,
            String imageUrl,
            boolean reserved,
            Long reservedById
    ) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.price = price;
        this.mileage = mileage;
        this.fuel = fuel;
        this.body = body;
        this.imageUrl = imageUrl;
        this.reserved = reserved;
        this.reservedById = reservedById;
    }
}
