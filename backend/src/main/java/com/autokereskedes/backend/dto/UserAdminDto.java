package com.autokereskedes.backend.dto;
import com.autokereskedes.backend.model.User;
import java.time.LocalDateTime;

public class UserAdminDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String country;
    private String role;
    private LocalDateTime createdAt;

    public static UserAdminDto from(User u) {
        UserAdminDto d = new UserAdminDto();
        d.id = u.getId();
        d.firstName = u.getFirstName();
        d.lastName = u.getLastName();
        d.email = u.getEmail();
        d.phone = u.getPhone();
        d.country = u.getCountry();
        d.role = u.getRole() != null ? u.getRole().name() : "USER";
        d.createdAt = u.getCreatedAt();
        return d;
    }
    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getCountry() { return country; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
