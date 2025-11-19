package com.autokereskedes.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class UsedCarDetailDto {

    private Long id;
    private Long ownerId;

    private String brand;
    private String model;
    private String engineName;
    private Integer year;
    private Integer price;
    private Integer mileage;
    private String fuel;
    private String transmission;
    private String bodyType;
    private String condition;

    private Integer doors;
    private Integer seats;
    private Integer trunkCapacity;
    private Integer engineSize;
    private Integer weight;
    private Integer totalWeight;
    private String klimaType;
    private String engineLayout;
    private String drivetrain;
    private String docs;
    private String tireSize;

    private String location;
    private String dealer;
    private String description;

    private List<String> images;
    private UsedCarFeaturesDto features;

    private boolean reserved;
    private String reservedByUsername;
    private Long reservedById;
    private boolean userHasReserved;

    private Long sellerId;
    private String sellerName;
}
