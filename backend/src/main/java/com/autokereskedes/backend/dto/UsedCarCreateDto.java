package com.autokereskedes.backend.dto;

import lombok.Data;

@Data
public class UsedCarCreateDto {
    private String brand;
    private String model;
    private Integer year;
    private Integer price;
    private Integer mileage;
    private String fuel;
    private Integer engineSize;
    private String transmission;
    private String bodyType;
    private String condition;
    private Integer doors;
    private Integer seats;
    private Integer trunkCapacity;
    private String drivetrain;
    private String engineLayout;
    private String klimaType;
    private String docs;
    private String tireSize;
    private String location;
    private String dealer;
     private String description;
     private Long engineId; 

}
