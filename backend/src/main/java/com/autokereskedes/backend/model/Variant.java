package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "variant")
public class Variant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer price;
    private Integer power;
    private String drive;
    private String range;
    private String imageUrl;
    private String carType;
    private String fuel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private Model model;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Engine> engines = new HashSet<>();

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<StockVehicle> stockVehicles = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String exteriorDescription;

    @Column(name = "exterior_image_url", columnDefinition = "TEXT")
    private String exteriorImageUrl;

    @Column(columnDefinition = "TEXT")
    private String exteriorImages;

    @Column(columnDefinition = "TEXT")
    private String interiorDescription;

    @Column(columnDefinition = "TEXT")
    private String interiorImageUrl;

    @Column(columnDefinition = "TEXT")
    private String interiorImages;

    @Column(columnDefinition = "TEXT")
    private String innovationDescription;

    @Column(columnDefinition = "TEXT")
    private String innovationImageUrl;

    @Column(columnDefinition = "TEXT")
    private String safetyDescription;

    @Column(columnDefinition = "TEXT")
    private String safetyImageUrl;

    @Column(columnDefinition = "TEXT")
    private String driverAssistanceDescription;

    @Column(columnDefinition = "TEXT")
    private String driverAssistanceImageUrl;

    @Column(columnDefinition = "TEXT")
    private String matrixLightDescription;

    @Column(columnDefinition = "TEXT")
    private String matrixLightImageUrl;

    @Column(columnDefinition = "TEXT")
    private String safeAssistanceDescription;

    @Column(columnDefinition = "TEXT")
    private String safeAssistanceImageUrl;

    @Column(columnDefinition = "TEXT")
    private String parkingAssistanceDescription;

    @Column(columnDefinition = "TEXT")
    private String parkingAssistanceImageUrl;

    @Column(columnDefinition = "TEXT")
    private String colorGalleries;

    @Column(columnDefinition = "TEXT")
    private String sizeImageUrl;

    @Column(name = "technology_images", columnDefinition = "TEXT")
    private String technologyImages;

    @Column(name = "technology_descriptions", columnDefinition = "TEXT")
    private String technologyDescriptions;

    private String transmission; 
    private String color;       
    private String plateNumber;  
    private String decoration;  

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public Integer getPower() { return power; }
    public void setPower(Integer power) { this.power = power; }

    public String getDrive() { return drive; }
    public void setDrive(String drive) { this.drive = drive; }

    public String getRange() { return range; }
    public void setRange(String range) { this.range = range; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCarType() { return carType; }
    public void setCarType(String carType) { this.carType = carType; }

    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }

    public Model getModel() { return model; }
    public void setModel(Model model) { this.model = model; }

    public Set<Engine> getEngines() { return engines; }
    public void setEngines(Set<Engine> engines) { this.engines = engines; }

    public Set<StockVehicle> getStockVehicles() { return stockVehicles; }
    public void setStockVehicles(Set<StockVehicle> stockVehicles) { this.stockVehicles = stockVehicles; }

    public String getExteriorDescription() { return exteriorDescription; }
    public void setExteriorDescription(String exteriorDescription) { this.exteriorDescription = exteriorDescription; }

    public String getExteriorImageUrl() { return exteriorImageUrl; }
    public void setExteriorImageUrl(String exteriorImageUrl) { this.exteriorImageUrl = exteriorImageUrl; }

    public String getExteriorImages() { return exteriorImages; }
    public void setExteriorImages(String exteriorImages) { this.exteriorImages = exteriorImages; }

    public String getInteriorDescription() { return interiorDescription; }
    public void setInteriorDescription(String interiorDescription) { this.interiorDescription = interiorDescription; }

    public String getInteriorImageUrl() { return interiorImageUrl; }
    public void setInteriorImageUrl(String interiorImageUrl) { this.interiorImageUrl = interiorImageUrl; }

    public String getInteriorImages() { return interiorImages; }
    public void setInteriorImages(String interiorImages) { this.interiorImages = interiorImages; }

    public String getInnovationDescription() { return innovationDescription; }
    public void setInnovationDescription(String innovationDescription) { this.innovationDescription = innovationDescription; }

    public String getInnovationImageUrl() { return innovationImageUrl; }
    public void setInnovationImageUrl(String innovationImageUrl) { this.innovationImageUrl = innovationImageUrl; }

    public String getSafetyDescription() { return safetyDescription; }
    public void setSafetyDescription(String safetyDescription) { this.safetyDescription = safetyDescription; }

    public String getSafetyImageUrl() { return safetyImageUrl; }
    public void setSafetyImageUrl(String safetyImageUrl) { this.safetyImageUrl = safetyImageUrl; }

    public String getDriverAssistanceDescription() { return driverAssistanceDescription; }
    public void setDriverAssistanceDescription(String driverAssistanceDescription) { this.driverAssistanceDescription = driverAssistanceDescription; }

    public String getDriverAssistanceImageUrl() { return driverAssistanceImageUrl; }
    public void setDriverAssistanceImageUrl(String driverAssistanceImageUrl) { this.driverAssistanceImageUrl = driverAssistanceImageUrl; }

    public String getMatrixLightDescription() { return matrixLightDescription; }
    public void setMatrixLightDescription(String matrixLightDescription) { this.matrixLightDescription = matrixLightDescription; }

    public String getMatrixLightImageUrl() { return matrixLightImageUrl; }
    public void setMatrixLightImageUrl(String matrixLightImageUrl) { this.matrixLightImageUrl = matrixLightImageUrl; }

    public String getSafeAssistanceDescription() { return safeAssistanceDescription; }
    public void setSafeAssistanceDescription(String safeAssistanceDescription) { this.safeAssistanceDescription = safeAssistanceDescription; }

    public String getSafeAssistanceImageUrl() { return safeAssistanceImageUrl; }
    public void setSafeAssistanceImageUrl(String safeAssistanceImageUrl) { this.safeAssistanceImageUrl = safeAssistanceImageUrl; }

    public String getParkingAssistanceDescription() { return parkingAssistanceDescription; }
    public void setParkingAssistanceDescription(String parkingAssistanceDescription) { this.parkingAssistanceDescription = parkingAssistanceDescription; }

    public String getParkingAssistanceImageUrl() { return parkingAssistanceImageUrl; }
    public void setParkingAssistanceImageUrl(String parkingAssistanceImageUrl) { this.parkingAssistanceImageUrl = parkingAssistanceImageUrl; }

    public String getColorGalleries() { return colorGalleries; }
    public void setColorGalleries(String colorGalleries) { this.colorGalleries = colorGalleries; }

    public String getSizeImageUrl() { return sizeImageUrl; }
    public void setSizeImageUrl(String sizeImageUrl) { this.sizeImageUrl = sizeImageUrl; }

    public String getTechnologyImages() { return technologyImages; }
    public void setTechnologyImages(String technologyImages) { this.technologyImages = technologyImages; }

    public String getTechnologyDescriptions() { return technologyDescriptions; }
    public void setTechnologyDescriptions(String technologyDescriptions) { this.technologyDescriptions = technologyDescriptions; }
    public String getTransmission() { return transmission; }
public void setTransmission(String transmission) { this.transmission = transmission; }

public String getColor() { return color; }
public void setColor(String color) { this.color = color; }

public String getPlateNumber() { return plateNumber; }
public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

public String getDecoration() { return decoration; }
public void setDecoration(String decoration) { this.decoration = decoration; }

}
