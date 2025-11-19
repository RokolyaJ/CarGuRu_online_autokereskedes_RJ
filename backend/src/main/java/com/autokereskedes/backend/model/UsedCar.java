package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "usedcars")
public class UsedCar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private Integer year;
    private Integer price;
    private Integer mileage;
    private String fuel;

    @Column(name = "engine_size")
    private Integer engineSize;

    private String transmission;

    @Column(name = "body_type")
    private String bodyType;

    private String condition;
    private String location;
    private String dealer;

    private Integer doors;
    private Integer seats;

    @Column(name = "trunk_capacity")
    private Integer trunkCapacity;

    private Integer weight;

    @Column(name = "total_weight")
    private Integer totalWeight;

    @Column(name = "klima_type")
    private String klimaType;

    @OneToMany(
            mappedBy = "car",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<UsedCarImage> images = new ArrayList<>();

    @Column(name = "engine_layout")
    private String engineLayout;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    private String drivetrain;
    private String docs;

    @ManyToOne
    @JoinColumn(name = "engine_id")
    private Engine engine;

    @Column(name = "tire_size")
    private String tireSize;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToOne(mappedBy = "car", fetch = FetchType.LAZY, cascade = CascadeType.ALL, optional = true)
    private UsedCarFeatures features;
}
