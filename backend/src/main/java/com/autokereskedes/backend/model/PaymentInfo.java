package com.autokereskedes.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payment_info")
public class PaymentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private String cardName;

    @Column(nullable = false)
    private String cardNumber;

    @Column(nullable = false)
    private String cardExpiry;

    @Column(nullable = false)
    private String cardCvv;

    private boolean active = true;

    public PaymentInfo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCardName() { return cardName; }
    public void setCardName(String cardName) { this.cardName = cardName; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getCardExpiry() { return cardExpiry; }
    public void setCardExpiry(String cardExpiry) { this.cardExpiry = cardExpiry; }

    public String getCardCvv() { return cardCvv; }
    public void setCardCvv(String cardCvv) { this.cardCvv = cardCvv; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
