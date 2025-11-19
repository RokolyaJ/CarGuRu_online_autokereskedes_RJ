package com.autokereskedes.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "delivery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"delivery"})
    private Order order;

    @Enumerated(EnumType.STRING)
    private DeliveryType type;

    private OffsetDateTime scheduledAt;
    private String addressLine;
    private String addressCity;
    private String addressZip;
    private Long feeHuf;
}
