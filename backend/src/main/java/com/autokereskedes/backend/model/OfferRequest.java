package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "offer_requests")
public class OfferRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vin;

    private String megszolitas;
    private String keresztnev;
    private String vezeteknev;
    private String phone;
    private String email;

    private String utca;
    private String hazszam;
    private String iranyitoszam;
    private String telepules;

    
    private String dealer;

    @Column(length = 2000)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
