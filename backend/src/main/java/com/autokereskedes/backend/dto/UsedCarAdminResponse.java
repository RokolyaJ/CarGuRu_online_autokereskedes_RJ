package com.autokereskedes.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class UsedCarAdminResponse {
    private Long userId;
    private String fullName;
    private List<UsedCarAdminDto> cars;

    public UsedCarAdminResponse(Long userId, String fullName, List<UsedCarAdminDto> cars) {
        this.userId = userId;
        this.fullName = fullName;
        this.cars = cars;
    }
}
