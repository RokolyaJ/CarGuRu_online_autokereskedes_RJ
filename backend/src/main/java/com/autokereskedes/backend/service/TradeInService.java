package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.TradeIn;
import com.autokereskedes.backend.model.TradeInImage;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.TradeInRepository;
import com.autokereskedes.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TradeInService {

    private final TradeInRepository tradeInRepository;
    private final UserRepository userRepository;
    private final Path uploadDir = Paths.get("uploads/tradein");

    public TradeInService(TradeInRepository tradeInRepository, UserRepository userRepository) {
        this.tradeInRepository = tradeInRepository;
        this.userRepository = userRepository;

        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Nem sikerült létrehozni az upload mappát: " + uploadDir, e);
        }
    }

    public TradeIn saveTradeInWithUserAndImages(TradeIn tradeIn, MultipartFile[] images, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található: " + email));

        tradeIn.setUser(user);
        if (tradeIn.getCreatedAt() == null) tradeIn.setCreatedAt(OffsetDateTime.now());
        if (tradeIn.getStatus() == null || tradeIn.getStatus().isBlank()) tradeIn.setStatus("ESTIMATED");

        tradeIn.setEstValueHuf(calculateEstimatedValue(tradeIn));
        TradeIn savedTradeIn = tradeInRepository.save(tradeIn);

        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    try {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path filePath = uploadDir.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                        TradeInImage image = new TradeInImage();
                        image.setUrl("/uploads/tradein/" + fileName);
                        image.setTradeIn(savedTradeIn);
                        savedTradeIn.addImage(image);

                    } catch (IOException e) {
                        throw new RuntimeException("Hiba történt a kép mentésekor: " + file.getOriginalFilename(), e);
                    }
                }
            }
            savedTradeIn = tradeInRepository.save(savedTradeIn);
        }

        return savedTradeIn;
    }

   private Long calculateEstimatedValue(TradeIn tradeIn) {
    long baseValue = 10_000_000L;

    int year = tradeIn.getYear() != null ? tradeIn.getYear() : 2020;
    int age = 2025 - year;

    long mileage = tradeIn.getMileage() != null ? tradeIn.getMileage() : 0;
    int condition = tradeIn.getCondition() != null ? tradeIn.getCondition() : 3;

    long agePenalty = age * 250_000L;
    long mileagePenalty = (mileage / 1000) * 100;
    long conditionBonus = (condition - 3) * 250_000L;

    long estimated = baseValue - agePenalty - mileagePenalty + conditionBonus;

    return Math.max(estimated, 500_000L);
}


    public List<TradeIn> findAllByUserId(Long userId) {
        return tradeInRepository.findAllByUser_Id(userId);
    }

@Transactional
public TradeIn acceptTradeIn(Long id, String email) {
    TradeIn tradeIn = tradeInRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Trade-in nem található"));

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Felhasználó nem található"));

    if (!tradeIn.getUser().getId().equals(user.getId())) {
        throw new RuntimeException("Nincs jogosultság ehhez az autóhoz.");
    }

    if (tradeIn.getEstValueHuf() == null) {
        tradeIn.setEstValueHuf(calculateEstimatedValue(tradeIn));
    }

    long currentBalance = user.getBalance() == null ? 0L : user.getBalance();
    long estimated = tradeIn.getEstValueHuf() == null ? 0L : tradeIn.getEstValueHuf();
    long newBalance = currentBalance + estimated;

    user.setBalance(newBalance);
    tradeIn.setStatus("ACCEPTED");

    userRepository.saveAndFlush(user);
    tradeInRepository.saveAndFlush(tradeIn);

    System.out.println("Trade-in elfogadva: " + id + " | Új egyenleg: " + newBalance);

    tradeIn.setUser(user);
    return tradeIn;
}

    public TradeIn declineTradeIn(Long id, String email) {
        TradeIn tradeIn = tradeInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade-in nem található"));
        tradeIn.setStatus("DECLINED");
        return tradeInRepository.save(tradeIn);
    }

    public TradeIn updateTradeIn(Long id, TradeIn updatedTradeIn, MultipartFile[] images, String email) {
        TradeIn existing = tradeInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade-in nem található ID: " + id));

        if (!existing.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Nincs jogosultság a módosításhoz.");
        }

        existing.setMake(updatedTradeIn.getMake());
        existing.setModel(updatedTradeIn.getModel());
        existing.setYear(updatedTradeIn.getYear());
        existing.setMileage(updatedTradeIn.getMileage());
        existing.setVin(updatedTradeIn.getVin());
        existing.setFuelType(updatedTradeIn.getFuelType());
        existing.setPower(updatedTradeIn.getPower());
        existing.setEngineSize(updatedTradeIn.getEngineSize());
        existing.setCondition(updatedTradeIn.getCondition());
        existing.setColor(updatedTradeIn.getColor());
        existing.setInteriorColor(updatedTradeIn.getInteriorColor());
        existing.setLuggage(updatedTradeIn.getLuggage());
        existing.setWeight(updatedTradeIn.getWeight());
        existing.setSeats(updatedTradeIn.getSeats());
        existing.setGearbox(updatedTradeIn.getGearbox());
        existing.setDrivetrain(updatedTradeIn.getDrivetrain());
        existing.setBodyType(updatedTradeIn.getBodyType());
        existing.setDocuments(updatedTradeIn.getDocuments());
        existing.setTechnicalValidity(updatedTradeIn.getTechnicalValidity());
        existing.setDescription(updatedTradeIn.getDescription());

        existing.setEstValueHuf(calculateEstimatedValue(updatedTradeIn));

        if (images != null && images.length > 0) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    try {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        Path filePath = uploadDir.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                        TradeInImage newImage = new TradeInImage();
                        newImage.setUrl("/uploads/tradein/" + fileName);
                        newImage.setTradeIn(existing);
                        existing.addImage(newImage);

                    } catch (IOException e) {
                        throw new RuntimeException("Hiba a kép mentésekor: " + file.getOriginalFilename(), e);
                    }
                }
            }
        }

        return tradeInRepository.save(existing);
    }
    public void deleteTradeIn(Long id, String email) {
        TradeIn tradeIn = tradeInRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trade-in nem található ID: " + id));

        if (!tradeIn.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Nincs jogosultság a törléshez.");
        }

        tradeInRepository.delete(tradeIn);
    }
    public TradeIn saveTradeInWithUser(TradeIn tradeIn, String email) {
    var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Felhasználó nem található: " + email));

    tradeIn.setUser(user);
    tradeIn.setStatus("ESTIMATED");
    tradeIn.setEstValueHuf(calculateEstimatedValue(tradeIn));

    return tradeInRepository.save(tradeIn);
}

}
