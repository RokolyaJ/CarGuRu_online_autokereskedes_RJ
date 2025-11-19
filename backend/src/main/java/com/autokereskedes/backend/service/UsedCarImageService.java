package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.UsedCarImage;
import com.autokereskedes.backend.repository.UsedCarImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.nio.file.StandardOpenOption;
import java.util.Optional;
import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UsedCarImageService {

    private final UsedCarImageRepository repository;
    private static final String UPLOAD_DIR = "uploads/usedcars/";
    public UsedCarImageService(UsedCarImageRepository repository) {
        this.repository = repository;
    }
    public List<UsedCarImage> getImagesByCarId(Long carId) {
        return repository.findByCarIdOrderBySortOrderAsc(carId);
    }
    public void saveImages(Long carId, List<MultipartFile> files) throws IOException {

        String carFolder = UPLOAD_DIR + carId + "/";
        File dir = new File(carFolder);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        int sortOrder = repository.findByCarIdOrderBySortOrderAsc(carId).size();

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                String originalFilename = file.getOriginalFilename();
                String filePath = carFolder + originalFilename;
                Path path = Paths.get(filePath);
                Files.write(path, file.getBytes());
                UsedCarImage image = new UsedCarImage();
                image.setCarId(carId);
                image.setImage("/uploads/usedcars/" + carId + "/" + originalFilename); 
                image.setSortOrder(sortOrder);
                repository.save(image);

                sortOrder++;
            }
        }
    }
    public List<String> saveTempImages(String tempId, List<MultipartFile> files) throws IOException {
        Path tempDir = Paths.get("uploads/temp/", tempId);
        if (!Files.exists(tempDir)) {
            Files.createDirectories(tempDir);
        }

        List<String> savedPaths = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFilename = file.getOriginalFilename();
            String uniqueName = System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = tempDir.resolve(uniqueName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            savedPaths.add("/uploads/temp/" + tempId + "/" + uniqueName);
        }

        return savedPaths;
    }
    public List<UsedCarImage> getTempImages(String tempId) throws IOException {
        Path tempDir = Paths.get("uploads/temp/", tempId);
        List<UsedCarImage> images = new ArrayList<>();

        if (!Files.exists(tempDir)) {
            return images; 
        }

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(tempDir)) {
            int index = 0;
            for (Path file : stream) {
                UsedCarImage img = new UsedCarImage();
                img.setCarId(null);
                img.setImage("/uploads/temp/" + tempId + "/" + file.getFileName().toString());
                img.setSortOrder(index++);
                images.add(img);
            }
        }
        return images;
    }
    public void moveTempImagesToCar(Long carId, String tempId) throws IOException {
        Path tempDir = Paths.get("uploads/temp/", tempId);
        Path carDir = Paths.get(UPLOAD_DIR, String.valueOf(carId));

        if (!Files.exists(tempDir)) {
            throw new IOException("A temp mappa nem található: " + tempDir);
        }

        if (!Files.exists(carDir)) {
            Files.createDirectories(carDir);
        }

        int sortOrder = repository.findByCarIdOrderBySortOrderAsc(carId).size();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(tempDir)) {
            for (Path file : stream) {
                String filename = file.getFileName().toString();
                Path target = carDir.resolve(filename);

                Files.move(file, target, StandardCopyOption.REPLACE_EXISTING);

                UsedCarImage image = new UsedCarImage();
                image.setCarId(carId);
                image.setImage("/uploads/usedcars/" + carId + "/" + filename);
                image.setSortOrder(sortOrder++);
                repository.save(image);
            }
        }

Files.walk(tempDir)
     .sorted(java.util.Comparator.reverseOrder())
     .forEach(path -> {
         try { Files.delete(path); } catch (IOException ignored) {}
     });
    }
    public String generateTempId() {
        return UUID.randomUUID().toString();
    }
    @Transactional
public void assignTempImagesToCar(String tempId, Long carId) {
    try {
        moveTempImagesToCar(carId, tempId);
        List<UsedCarImage> tempImages = repository.findByTempId(tempId);
        for (UsedCarImage img : tempImages) {
            img.setCarId(carId);
            img.setTempId(null);
        }
        repository.saveAll(tempImages);

    } catch (IOException e) {
        throw new RuntimeException("Hiba a képek áthelyezésekor: " + e.getMessage(), e);
    }
}

@Transactional
public void deleteImage(Long imageId) {
    UsedCarImage image = repository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Kép nem található ID alapján: " + imageId));

    try {
        if (image.getImage() != null) {
            Path path = Paths.get("." + image.getImage());
            if (Files.exists(path)) {
                Files.delete(path);
            }
        }
    } catch (IOException e) {
        throw new RuntimeException("Hiba a fájl törlésekor: " + e.getMessage(), e);
    }

    repository.delete(image);
}


@Transactional
public void setAsCover(Long imageId) {
    UsedCarImage image = repository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Kép nem található ID alapján: " + imageId));

    Long carId = image.getCarId();
    if (carId == null) {
        throw new RuntimeException("Ez a kép még nincs autóhoz rendelve!");
    }

    repository.clearCoverForCar(carId);

    image.setCover(true);
    repository.save(image);
}
}
