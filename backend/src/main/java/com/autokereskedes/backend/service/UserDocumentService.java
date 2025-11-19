package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.model.UserDocument;
import com.autokereskedes.backend.repository.UserDocumentRepository;
import com.autokereskedes.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDocumentService {

    private final UserRepository userRepository;
    private final UserDocumentRepository userDocumentRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public UserDocument uploadOrUpdateFile(Long userId, String type, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található"));

        String username = user.getUsername();
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Felhasználónév hiányzik, nem lehet menteni a fájlt.");
        }

        Path userFolder = Paths.get(UPLOAD_DIR, username);
        Files.createDirectories(userFolder);

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = userFolder.resolve(fileName);

        Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);

        String fileUrl = "/uploads/" + username + "/" + fileName;

        Optional<UserDocument> existing = userDocumentRepository.findByUserIdAndType(userId, type);

        if (existing.isPresent()) {
            UserDocument doc = existing.get();
            doc.setUrl(fileUrl);
            doc.setStatus("PENDING");
            doc.setUploadedAt(OffsetDateTime.now());
            return userDocumentRepository.save(doc);
        }

        UserDocument newDoc = new UserDocument();
        newDoc.setUser(user);
        newDoc.setType(type);
        newDoc.setUrl(fileUrl);
        newDoc.setStatus("PENDING");
        newDoc.setUploadedAt(OffsetDateTime.now());

        return userDocumentRepository.save(newDoc);
    }

    public List<UserDocument> getUserDocuments(Long userId) {
        return userDocumentRepository.findByUserId(userId);
    }
}
