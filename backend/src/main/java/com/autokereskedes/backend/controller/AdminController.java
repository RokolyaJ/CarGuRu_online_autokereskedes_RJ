package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.ResetPasswordRequest;
import com.autokereskedes.backend.dto.UserAdminDto;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<UserAdminDto> listUsers() {
        return userService.getAllUsers()
                .stream()
                .map(UserAdminDto::from)
                .collect(Collectors.toList());
    }

    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id,
                                           @RequestBody ResetPasswordRequest req) {
        if (req.getNewPassword() == null || req.getNewPassword().length() < 8) {
            return ResponseEntity.badRequest()
                    .body("A jelszónak legalább 8 karakter hosszúnak kell lennie.");
        }

        try {
            userService.resetPassword(id, req.getNewPassword());
            return ResponseEntity.ok("Jelszó sikeresen visszaállítva.");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable Long id,
                                        @RequestParam("role") String role) {
        try {
            User.Role newRole = User.Role.valueOf(role.toUpperCase());
            userService.changeRole(id, newRole);
            return ResponseEntity.ok("Szerep sikeresen módosítva: " + newRole);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Érvénytelen szerep: " + role);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
