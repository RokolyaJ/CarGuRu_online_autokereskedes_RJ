package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.AuthResponse;
import com.autokereskedes.backend.dto.RegisterRequest;
import com.autokereskedes.backend.dto.LoginRequest;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.service.UserService;
import com.autokereskedes.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            User user = new User();
            user.setFirstName(req.getFirstName());
            user.setLastName(req.getLastName());
            user.setEmail(req.getEmail());
            user.setPasswordHash(req.getPassword());
            user.setPhone(req.getPhone());
            user.setCountry(req.getCountry());

            User saved = userService.register(user);
            String token = jwtService.generateToken(saved);

            return ResponseEntity.ok(
                    new AuthResponse(
                            token,
                            saved.getEmail(),
                            saved.getFirstName() + " " + saved.getLastName(),
                            saved.getRole().name(),
                            saved.getId() 
                    )
            );
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            User user = userService.login(req.getEmail(), req.getPassword());
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(
                    new AuthResponse(
                            token,
                            user.getEmail(),
                            user.getFirstName() + " " + user.getLastName(),
                            user.getRole().name(),
                            user.getId() 
                    )
            );
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));
        return ResponseEntity.ok(user);
    }
}
