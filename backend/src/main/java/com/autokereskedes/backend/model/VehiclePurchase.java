package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vehicle_purchase")
public class VehiclePurchase {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true, length = 17)
    private String vin;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    private String brand;
    private String model;
    private String variant;
    private String engine;
    private String color;

    @Column(columnDefinition = "TEXT")
    private String equipments;

    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;

    private String dealership;
    private BigDecimal price;
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getVariant() { return variant; }
    public void setVariant(String variant) { this.variant = variant; }

    public String getEngine() { return engine; }
    public void setEngine(String engine) { this.engine = engine; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getEquipments() { return equipments; }
    public void setEquipments(String equipments) { this.equipments = equipments; }

    public LocalDateTime getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getDealership() { return dealership; }
    public void setDealership(String dealership) { this.dealership = dealership; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
