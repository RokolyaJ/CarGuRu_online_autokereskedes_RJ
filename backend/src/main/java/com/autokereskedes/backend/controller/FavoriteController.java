package com.autokereskedes.backend.controller;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.model.UsedCar;
import com.autokereskedes.backend.repository.UserRepository;
import com.autokereskedes.backend.repository.UsedCarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FavoriteController {

    private final UserRepository userRepository;
    private final UsedCarRepository usedCarRepository;

    @GetMapping
    public List<Long> getFavoriteIds(@AuthenticationPrincipal User user) {

        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

        return dbUser.getFavorites()
                .stream()
                .map(UsedCar::getId)
                .toList();
    }

    @PostMapping("/{carId}")
    public ResponseEntity<?> addFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long carId
    ) {
        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

        UsedCar car = usedCarRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Nincs ilyen autó (id=" + carId + ")"));

        if (!dbUser.getFavorites().contains(car)) {
            dbUser.getFavorites().add(car);
            userRepository.save(dbUser);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<?> removeFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long carId
    ) {
        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

        dbUser.getFavorites().removeIf(c -> c.getId().equals(carId));
        userRepository.save(dbUser);

        return ResponseEntity.ok().build();
    }
}
