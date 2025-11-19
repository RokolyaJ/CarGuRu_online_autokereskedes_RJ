    package com.autokereskedes.backend.model;

    import jakarta.persistence.*;
    import lombok.Getter;
    import lombok.Setter;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import java.time.OffsetDateTime;

    @Entity
    @Table(name = "orders")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class Order {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Column(name = "car_id")
        private Long carId;

        @Column(name = "total_price_huf")
        private Long totalPriceHuf;

        @Enumerated(EnumType.STRING)
        private PaymentMethod payment;

        @Column(name = "leasing_months")
        private Integer leasingMonths;

        @Column(name = "transfer_iban")
        private String transferIban;

        @Column(name = "transfer_ref")
        private String transferRef;

        @Column(name = "payment_status")
        private String paymentStatus;

        @Column(name = "created_at")
        private OffsetDateTime createdAt = OffsetDateTime.now();
        @Column(name = "balance_used")
        private Long balanceUsed;

        @Column(name = "payment_details")
        private String paymentDetails;

        @Column(name = "insurance_provider")
        private String insuranceProvider;

        @Column(name = "insurance_type")
        private String insuranceType;

        @Column(name = "insurance_duration_months")
        private Integer insuranceDurationMonths;

        @Column(name = "insurance_bonus_level")
        private String insuranceBonusLevel;

        @Column(name = "insurance_estimated_fee")
        private Long insuranceEstimatedFee;

        @Column(name = "delivery_method")
        private String deliveryMethod;

        @Column(name = "pickup_location")
        private String pickupLocation;

        @Column(name = "full_name")
        private String fullName;

        @Column(name = "phone")
        private String phone;

        @Column(name = "country")
        private String country;

        @Column(name = "city")
        private String city;

        @Column(name = "postal_code")
        private String postalCode;

        @Column(name = "address")
        private String address;

        @Column(name = "id_card_status")
        private String idCardStatus;

        @Column(name = "address_card_status")
        private String addressCardStatus;

    }
