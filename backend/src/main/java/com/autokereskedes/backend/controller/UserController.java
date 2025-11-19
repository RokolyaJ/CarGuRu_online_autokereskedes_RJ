package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.UserRepository;
import com.autokereskedes.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User dbUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

        return ResponseEntity
                .ok()
                .header("Cache-Control", "no-cache, no-store, must-revalidate")
                .header("Pragma", "no-cache")
                .header("Expires", "0")
                .body(dbUser);
    }

    @PutMapping("/me/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> updates) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User dbUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

        if (updates.containsKey("firstName")) dbUser.setFirstName((String) updates.get("firstName"));
        if (updates.containsKey("lastName")) dbUser.setLastName((String) updates.get("lastName"));
        if (updates.containsKey("phone")) dbUser.setPhone((String) updates.get("phone"));
        if (updates.containsKey("country")) dbUser.setCountry((String) updates.get("country"));
        if (updates.containsKey("birthDate")) {
            try {
                dbUser.setBirthDate(java.time.LocalDate.parse((String) updates.get("birthDate")));
            } catch (Exception ignored) {}
        }
        if (updates.containsKey("birthPlace")) dbUser.setBirthPlace((String) updates.get("birthPlace"));
        if (updates.containsKey("motherName")) dbUser.setMotherName((String) updates.get("motherName"));
        if (updates.containsKey("idCardNumber")) dbUser.setIdCardNumber((String) updates.get("idCardNumber"));
        if (updates.containsKey("idCardExpiry")) {
            try {
                dbUser.setIdCardExpiry(java.time.LocalDate.parse((String) updates.get("idCardExpiry")));
            } catch (Exception ignored) {}
        }
        if (updates.containsKey("personalNumber")) dbUser.setPersonalNumber((String) updates.get("personalNumber"));
        if (updates.containsKey("addressCountry")) dbUser.setAddressCountry((String) updates.get("addressCountry"));
        if (updates.containsKey("addressCity")) dbUser.setAddressCity((String) updates.get("addressCity"));
        if (updates.containsKey("addressZip")) dbUser.setAddressZip((String) updates.get("addressZip"));
        if (updates.containsKey("addressStreet")) dbUser.setAddressStreet((String) updates.get("addressStreet"));
        if (updates.containsKey("taxId")) dbUser.setTaxId((String) updates.get("taxId"));
        if (updates.containsKey("taxCardNumber")) dbUser.setTaxCardNumber((String) updates.get("taxCardNumber"));
        if (updates.containsKey("nationality")) dbUser.setNationality((String) updates.get("nationality"));

        if (updates.containsKey("bankAccount")) dbUser.setBankAccount((String) updates.get("bankAccount"));

        userRepository.save(dbUser);
        return ResponseEntity.ok("Profil sikeresen frissítve.");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> payload) {

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User dbUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

        String oldPass = payload.get("oldPassword");
        String newPass = payload.get("newPassword");

        if (oldPass == null || newPass == null) {
            return ResponseEntity.badRequest().body("Hiányzó jelszó mezők.");
        }

        if (!passwordEncoder.matches(oldPass, dbUser.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Hibás jelenlegi jelszó!");
        }

        dbUser.setPasswordHash(passwordEncoder.encode(newPass));
        userRepository.save(dbUser);

        return ResponseEntity.ok("Jelszó sikeresen módosítva.");
    }

    @PutMapping("/transfer")
    public ResponseEntity<String> transferFunds(
            @RequestParam String recipientEmail,
            @RequestParam Long amount,
            Principal principal) {
        userService.transferFunds(principal.getName(), recipientEmail, amount);
        return ResponseEntity.ok("Utalás sikeres!");
    }

    @PutMapping("/withdraw")
    public ResponseEntity<String> withdrawFunds(Principal principal) {
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

        if (user.getBankAccount() == null || user.getBankAccount().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Nincs megadva bankszámlaszám! Kérlek, töltsd ki a profilodban.");
        }

        userService.withdrawFunds(user.getEmail());
        return ResponseEntity.ok("Kifizetés megtörtént (egyenleg lenullázva)!");
    }
}
