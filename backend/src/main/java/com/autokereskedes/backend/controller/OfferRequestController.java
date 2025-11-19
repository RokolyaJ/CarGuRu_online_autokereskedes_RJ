package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.OfferRequest;
import com.autokereskedes.backend.repository.OfferRequestRepository;
import com.autokereskedes.backend.service.EmailService;
import com.autokereskedes.backend.service.PdfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offer")
@CrossOrigin(origins = "http://localhost:3000")
public class OfferRequestController {

    private final OfferRequestRepository repo;
    private final PdfService pdfService;
    private final EmailService emailService;

    public OfferRequestController(OfferRequestRepository repo, PdfService pdfService, EmailService emailService) {
        this.repo = repo;
        this.pdfService = pdfService;
        this.emailService = emailService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> createOffer(@RequestBody OfferRequest req) {
        try {
            OfferRequest saved = repo.save(req);

            byte[] pdf = pdfService.generateOfferPdf(saved);
            String fileName = "ajanlat_" + saved.getId() + ".pdf";

            emailService.sendOfferEmail(
                    saved.getEmail(),
                    "Ajánlatkérés visszaigazolás",
                    "<p>Köszönjük, fogadtuk az ajánlatkérését.</p><p>A Carguru csapata hamarosan felveszi Önnel a kapcsolatot.</p>",
                    pdf,
                    fileName
            );

            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.internalServerError().body("Hiba történt: " + ex.getMessage());
        }
    }
}
