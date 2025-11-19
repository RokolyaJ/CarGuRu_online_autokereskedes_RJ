package com.autokereskedes.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PurchaseResponse {

    private String vin;
    private String brand;
    private String model;
    private String variant;
    private String engine;
    private String color;
    private String equipments;
    private String dealership;
    private BigDecimal price;
    private LocalDateTime purchaseDate;
    private String buyerName;   

    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }

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

    public String getDealership() { return dealership; }
    public void setDealership(String dealership) { this.dealership = dealership; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public LocalDateTime getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
}
