package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_vehicle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private Model model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private Variant variant;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "model_name", nullable = false)
    private String modelName;

    private String fuelType;
    private Integer powerKw;
    private Integer powerHp;
    private Double engineL;
    private String transmission;
    private Integer gears;
    private String drivetrain;
    private Double consumptionL;
    private Integer co2Gkm;
    private String extColor;
    private String intColor;
    private Integer year;
    private Integer doors;
    private Integer seats;
    private Boolean vatReclaimable = false;
    private String modelCode;
    private Long priceHuf;
    private String location;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "city")
    private String city;

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(unique = true, nullable = false)
    private String vin;

    private String imageFrontUrl;
    private String imageSideUrl;
    private String imageBackUrl;
    private String imageInteriorUrl;

    @Builder.Default
    private String status = "AVAILABLE";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
