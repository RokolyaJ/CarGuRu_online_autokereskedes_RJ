package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "insurance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Insurance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long carId;

    @OneToOne(optional = true)
    @JoinColumn(name = "order_id", nullable = true)
    private Order order;

    private String provider;
    private String type;
    private Integer durationMonths;
    private String bonusClass;
    private Double priceHuf;

    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
}
