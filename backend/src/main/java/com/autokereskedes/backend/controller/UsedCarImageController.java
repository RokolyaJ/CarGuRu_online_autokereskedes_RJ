package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.UsedCarImage;
import com.autokereskedes.backend.service.UsedCarImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UsedCarImageController {

    private final UsedCarImageService imageService;

    public UsedCarImageController(UsedCarImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("/{carId}")
    public List<UsedCarImage> getImagesByCarId(@PathVariable Long carId) {
        return imageService.getImagesByCarId(carId);
    }

    @PostMapping("/upload/{carId}")
    public ResponseEntity<String> uploadImages(
            @PathVariable Long carId,
            @RequestParam("files") List<MultipartFile> files) {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("Nincs feltöltött fájl!");
        }

        try {
            imageService.saveImages(carId, files);
            return ResponseEntity.ok("Képek sikeresen feltöltve!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Hiba történt: " + e.getMessage());
        }
    }

    @PostMapping("/temp")
    public ResponseEntity<Map<String, Object>> uploadTempImages(
            @RequestParam("files") List<MultipartFile> files) {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nincs fájl a feltöltéshez"));
        }

        try {
            String tempId = UUID.randomUUID().toString();
            List<String> paths = imageService.saveTempImages(tempId, files);

            Map<String, Object> response = new HashMap<>();
            response.put("tempId", tempId);
            response.put("images", paths);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("Hiba!", e.getMessage()));
        }
    }

    @PostMapping("/temp/{tempId}")
    public ResponseEntity<?> uploadTempImagesWithId(
            @PathVariable String tempId,
            @RequestParam("files") List<MultipartFile> files) {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("Nincs feltöltött fájl!");
        }

        try {
            var savedPaths = imageService.saveTempImages(tempId, files);
            return ResponseEntity.ok(savedPaths);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Hiba történt: " + e.getMessage());
        }
    }

    @GetMapping("/temp/{tempId}")
    public ResponseEntity<?> getTempImages(@PathVariable String tempId) {
        try {
            List<UsedCarImage> images = imageService.getTempImages(tempId);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Hiba történt: " + e.getMessage());
        }
    }

@PostMapping("/assign/{tempId}/{carId}")
public ResponseEntity<?> assignTempImagesToCar(
        @PathVariable String tempId,
        @PathVariable Long carId) {
    try {
        imageService.assignTempImagesToCar(tempId, carId);
        return ResponseEntity.ok("Képek sikeresen hozzárendelve az autóhoz!");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError()
                .body("Hiba a képek hozzárendelésekor: " + e.getMessage());
    }
}
@DeleteMapping("/{imageId}")
public ResponseEntity<?> deleteImage(@PathVariable Long imageId) {
    try {
        imageService.deleteImage(imageId);
        return ResponseEntity.ok("Kép sikeresen törölve!");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body("Hiba a törlés során: " + e.getMessage());
    }
}

@PostMapping("/{imageId}/cover")
public ResponseEntity<?> setAsCover(@PathVariable Long imageId) {
    try {
        imageService.setAsCover(imageId);
        return ResponseEntity.ok("Borítókép sikeresen beállítva!");
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError()
                .body("Hiba a borítókép beállítása során: " + e.getMessage());
    }
}



}