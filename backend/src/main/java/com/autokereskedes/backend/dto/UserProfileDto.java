package com.autokereskedes.backend.dto;
import java.time.LocalDateTime;

public class UserProfileDto {
    private String firstName;
    private String lastName;
    private String email;
    private String country;
    private String phone;
    private LocalDateTime createdAt;
    public UserProfileDto(String firstName,
                          String lastName,
                          String email,
                          String country,
                          String phone,
                          LocalDateTime createdAt) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.country = country;
        this.phone = phone;
        this.createdAt = createdAt;
    }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getCountry() { return country; }
    public String getPhone() { return phone; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
