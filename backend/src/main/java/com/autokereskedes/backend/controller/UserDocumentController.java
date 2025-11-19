package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.UserDocument;
import com.autokereskedes.backend.service.UserDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = {"Authorization", "Content-Type"},
        exposedHeaders = {"Authorization"}
)
public class UserDocumentController {

    private final UserDocumentService userDocumentService;

    @PostMapping("/upload")
    public ResponseEntity<UserDocument> uploadDocument(
            @RequestParam Long userId,
            @RequestParam String type,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            UserDocument saved = userDocumentService.uploadOrUpdateFile(userId, type, file);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<UserDocument>> getUserDocuments(@RequestParam Long userId) {
        return ResponseEntity.ok(userDocumentService.getUserDocuments(userId));
    }
}
