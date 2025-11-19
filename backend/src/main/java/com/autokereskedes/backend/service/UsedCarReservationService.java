package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.UsedCar;
import com.autokereskedes.backend.model.UsedCarReservation;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.UsedCarRepository;
import com.autokereskedes.backend.repository.UsedCarReservationRepository;
import com.autokereskedes.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsedCarReservationService {

    private final UsedCarRepository usedCarRepository;
    private final UsedCarReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public UsedCarReservationService(
            UsedCarRepository usedCarRepository,
            UsedCarReservationRepository reservationRepository,
            UserRepository userRepository
    ) {
        this.usedCarRepository = usedCarRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    public UsedCarReservation reserve(Long usedCarId, Long userId) {

        UsedCar car = usedCarRepository.findById(usedCarId)
                .orElseThrow(() -> new IllegalArgumentException("Nincs ilyen használt autó: " + usedCarId));

        Optional<UsedCarReservation> existing =
                reservationRepository.findByUsedCarIdAndActiveTrue(usedCarId);

        if (existing.isPresent()) {
            throw new IllegalStateException("Az autó már le van foglalva.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Nincs ilyen felhasználó: " + userId));

        UsedCarReservation res = new UsedCarReservation();
        res.setUsedCar(car);
        res.setUser(user);
        res.setCreatedAt(LocalDateTime.now());
        res.setActive(true);

        return reservationRepository.save(res);
    }
    public void cancelReservation(Long usedCarId, Long currentUserId) {

        UsedCar car = usedCarRepository.findById(usedCarId)
                .orElseThrow(() -> new IllegalArgumentException("Nincs ilyen használt autó: " + usedCarId));

        UsedCarReservation res = reservationRepository.findByUsedCarIdAndActiveTrue(usedCarId)
                .orElseThrow(() -> new IllegalStateException("Az autó jelenleg nincs lefoglalva."));

        Long ownerId = car.getOwner().getId();      
        Long reserverId = res.getUser().getId();    

        boolean isOwner = ownerId.equals(currentUserId);
        boolean isReserver = reserverId.equals(currentUserId);

        if (!isOwner && !isReserver) {
            throw new AccessDeniedException("Nincs jogosultságod a foglalás törléséhez.");
        }

        res.setActive(false);
        reservationRepository.save(res);
    }
    public List<UsedCar> getMyReservedCars(Long userId) {
        return reservationRepository.findByUserIdAndActiveTrue(userId)
                .stream()
                .map(UsedCarReservation::getUsedCar)
                .collect(Collectors.toList());
    }
   public Optional<UsedCarReservation> findActiveReservationForCar(Long carId) {
    return reservationRepository.findByUsedCarIdAndActiveTrue(carId);
}

}

