package com.autokereskedes.backend.dto;

import lombok.Data;

@Data
public class TestDriveRequestDto {
    private Long vehicleId;

    private String brand;
    private String model;
    private String variant;

    private String fullName;
    private String email;
    private String phone;
    private String date;

    private Long price;
    private String fuel;
    private Integer powerHp;
    private String transmission;
    private String storeName;
    private String city;
}

