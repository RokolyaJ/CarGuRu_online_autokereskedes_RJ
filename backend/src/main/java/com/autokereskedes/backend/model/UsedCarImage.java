package com.autokereskedes.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usedcar_images")
public class UsedCarImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "car_id")
    private Long carId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", insertable = false, updatable = false)
    private UsedCar car;

    @Column(nullable = false)
    private String image;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_cover")
    private Boolean cover = false;

    @Column(name = "temp_id")
    private String tempId;

    public UsedCarImage() {}

    public UsedCarImage(Long carId, String image, Integer sortOrder) {
        this.carId = carId;
        this.image = image;
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public Boolean getCover() { return cover; }
    public void setCover(Boolean cover) { this.cover = (cover != null ? cover : false); }

    public String getTempId() { return tempId; }
    public void setTempId(String tempId) { this.tempId = tempId; }

    public String getUrl() {

    if (image.startsWith("http")) {
        return image;
    }

    if (image.contains("uploads/")) {
        return "http://localhost:8080/" + image.replaceFirst("^/", "");
    }

    return "http://localhost:8080/uploads/usedcars/" + image;
}

}
