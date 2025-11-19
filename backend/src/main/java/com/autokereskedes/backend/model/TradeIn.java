package com.autokereskedes.backend.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trade_in")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TradeIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private String make;
    private String model;
    private Integer year;

    @JsonProperty("mileageKm")
    @JsonAlias({"mileage", "mileageKm"})
    @Column(name = "mileage", nullable = false)
    private Integer mileage;

    private String vin;

    private String fuelType;
    private Integer power;
    private Integer engineSize;

    private Integer condition;
    private String color;
    private String interiorColor;
    private Integer luggage;
    private Integer weight;
    private Integer seats;
    private String gearbox;
    private String drivetrain;
    private String bodyType;
    private String documents;
    private String technicalValidity;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Long estValueHuf;

    @Builder.Default
    private String status = "ESTIMATED";

    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @OneToMany(mappedBy = "tradeIn", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TradeInImage> images = new ArrayList<>();

    public void addImage(TradeInImage image) {
        images.add(image);
        image.setTradeIn(this);
    }

    public void removeImage(TradeInImage image) {
        images.remove(image);
        image.setTradeIn(null);
    }

    @JsonProperty("userId")
    public Long getUserId() {
        return (user != null) ? user.getId() : null;
    }

    @JsonProperty("userId")
    public void setUserId(Long userId) {
        if (userId != null) {
            User u = new User();
            u.setId(userId);
            this.user = u;
        }
    }
}
