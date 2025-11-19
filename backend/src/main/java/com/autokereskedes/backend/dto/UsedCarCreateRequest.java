package com.autokereskedes.backend.dto;

import lombok.Data;

@Data
public class UsedCarCreateRequest {
    private UsedCarCreateDto car;              
    private UsedCarFeaturesCreateDto features;

    private String description;
}
