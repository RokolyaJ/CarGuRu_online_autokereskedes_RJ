package com.autokereskedes.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.autokereskedes.backend.model.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    public enum Role {
        USER,
        ADMIN
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String phone;
    private String country;

    private LocalDate birthDate;
    private String birthPlace;
    private String motherName;
    private String idCardNumber;
    private LocalDate idCardExpiry;
    private String personalNumber;
    private String addressCountry;
    private String addressCity;
    private String addressZip;
    private String addressStreet;
    private String taxId;
    private String taxCardNumber;
    private String nationality;

    @Column(name = "bank_account")
    private String bankAccount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private Long balance = 0L;
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonIgnore
private List<TradeIn> tradeIns;

@ManyToMany
@JoinTable(
        name = "user_favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "car_id")
)
@JsonIgnore
private List<UsedCar> favorites = new ArrayList<>();

public List<UsedCar> getFavorites() {
    return favorites;
}
public void setFavorites(List<UsedCar> favorites) {
    this.favorites = favorites;
}
    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getFirstName() { 
        return firstName; 
    }
    public void setFirstName(String firstName) { 
        this.firstName = firstName; 
    }

    public String getLastName() { 
        return lastName; 
    }
    public void setLastName(String lastName) { 
        this.lastName = lastName; 
    }

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email.toLowerCase().trim(); 
    }

    public String getPasswordHash() { 
        return passwordHash; 
    }
    public void setPasswordHash(String passwordHash) { 
        this.passwordHash = passwordHash; 
    }

    public String getPhone() { 
        return phone; 
    }
    public void setPhone(String phone) { 
        this.phone = phone; 
    }

    public String getCountry() { 
        return country; 
    }
    public void setCountry(String country) { 
        this.country = country; 
    }

    public LocalDate getBirthDate() { 
        return birthDate; 
    }
    public void setBirthDate(LocalDate birthDate) { 
        this.birthDate = birthDate; 
    }

    public String getBirthPlace() { 
        return birthPlace; 
    }
    public void setBirthPlace(String birthPlace) { 
        this.birthPlace = birthPlace; 
    }

    public String getMotherName() { 
        return motherName; 
    }
    public void setMotherName(String motherName) { 
        this.motherName = motherName; 
    }

    public String getIdCardNumber() { 
        return idCardNumber; 
    }
    public void setIdCardNumber(String idCardNumber) { 
        this.idCardNumber = idCardNumber; 
    }

    public LocalDate getIdCardExpiry() { 
        return idCardExpiry; 
    }
    public void setIdCardExpiry(LocalDate idCardExpiry) { 
        this.idCardExpiry = idCardExpiry; 
    }

    public String getPersonalNumber() { 
        return personalNumber; 
    }
    public void setPersonalNumber(String personalNumber) { 
        this.personalNumber = personalNumber; 
    }

    public String getAddressCountry() { 
        return addressCountry; 
    }
    public void setAddressCountry(String addressCountry) { 
        this.addressCountry = addressCountry; 
    }

    public String getAddressCity() { 
        return addressCity; 
    }
    public void setAddressCity(String addressCity) { 
        this.addressCity = addressCity; 
    }

    public String getAddressZip() { 
        return addressZip; 
    }
    public void setAddressZip(String addressZip) { 
        this.addressZip = addressZip; 
    }

    public String getAddressStreet() { 
        return addressStreet; 
    }
    public void setAddressStreet(String addressStreet) { 
        this.addressStreet = addressStreet; 
    }

    public String getTaxId() { 
        return taxId; 
    }
    public void setTaxId(String taxId) { 
        this.taxId = taxId; 
    }

    public String getTaxCardNumber() { 
        return taxCardNumber; 
    }
    public void setTaxCardNumber(String taxCardNumber) { 
        this.taxCardNumber = taxCardNumber; 
    }

    public String getNationality() { 
        return nationality; 
    }
    public void setNationality(String nationality) { 
        this.nationality = nationality; 
    }

    public String getBankAccount() { 
        return bankAccount; 
    }
    public void setBankAccount(String bankAccount) { 
        this.bankAccount = bankAccount; 
    }

    public Role getRole() { 
        return role; 
    }
    public void setRole(Role role) { 
        this.role = role; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }

    public Long getBalance() { 
        return balance; 
    }
    public void setBalance(Long balance) { 
        this.balance = balance; 
    }

    public List<TradeIn> getTradeIns() { 
        return tradeIns; 
    }
    public void setTradeIns(List<TradeIn> tradeIns) { 
        this.tradeIns = tradeIns; 
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() { 
        return passwordHash; 
    }

    @Override
    public String getUsername() { 
        return email; 
    }

    @Override
    public boolean isAccountNonExpired() { 
        return true; 
    }

    @Override
    public boolean isAccountNonLocked() { 
        return true; 
    }

    @Override
    public boolean isCredentialsNonExpired() { 
        return true; 
    }

    @Override
    public boolean isEnabled() { 
        return true; 
    }
}
