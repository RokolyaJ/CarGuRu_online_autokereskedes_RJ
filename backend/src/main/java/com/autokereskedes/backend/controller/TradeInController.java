package com.autokereskedes.backend.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
import com.autokereskedes.backend.model.TradeIn;
import com.autokereskedes.backend.service.TradeInService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tradein")
@CrossOrigin(
    origins = "http://localhost:3000",
    allowCredentials = "true",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*"
)
public class TradeInController {

    private final TradeInService tradeInService;

    public TradeInController(TradeInService tradeInService) {
        this.tradeInService = tradeInService;
    }

    @PostMapping(value = "/create", consumes = "application/json")
    public ResponseEntity<?> createTradeInJson(
            @RequestBody TradeIn tradeIn,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized – nincs bejelentkezett felhasználó"));
        }

        try {
            String email = userDetails.getUsername();
            TradeIn saved = tradeInService.saveTradeInWithUser(tradeIn, email);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

  @PostMapping(value = "/create", consumes = {"multipart/form-data"})
public ResponseEntity<TradeIn> createTradeIn(
        @RequestPart("tradeIn") MultipartFile tradeInPart,
        @RequestPart(value = "images", required = false) MultipartFile[] images,
        Principal principal) throws IOException {

    String tradeInJson = new String(tradeInPart.getBytes(), StandardCharsets.UTF_8);
    ObjectMapper mapper = new ObjectMapper();
    TradeIn tradeIn = mapper.readValue(tradeInJson, TradeIn.class);

    TradeIn saved = tradeInService.saveTradeInWithUserAndImages(tradeIn, images, principal.getName());
    return ResponseEntity.ok(saved);
}

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TradeIn>> getUserTradeIns(@PathVariable Long userId) {
        List<TradeIn> tradeIns = tradeInService.findAllByUserId(userId);
        return ResponseEntity.ok(tradeIns);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Map<String, Object>> acceptTradeIn(@PathVariable Long id, Principal principal) {
        TradeIn tradeIn = tradeInService.acceptTradeIn(id, principal.getName());

        Long newBalance = tradeIn.getUser().getBalance();
        Long credited = tradeIn.getEstValueHuf();

        return ResponseEntity.ok(
                Map.of(
                        "message", "Autó elfogadva és az egyenleg frissítve!",
                        "tradeInId", tradeIn.getId(),
                        "creditedAmount", credited,
                        "newBalance", newBalance
                )
        );
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<TradeIn> declineTradeIn(@PathVariable Long id, Principal principal) {
        TradeIn declined = tradeInService.declineTradeIn(id, principal.getName());
        return ResponseEntity.ok(declined);
    }

    @PutMapping(value = "/update/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<TradeIn> updateTradeIn(
            @PathVariable Long id,
            @RequestPart("tradeIn") TradeIn updatedTradeIn,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            Principal principal) {

        TradeIn updated = tradeInService.updateTradeIn(id, updatedTradeIn, images, principal.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTradeIn(@PathVariable Long id, Principal principal) {
        tradeInService.deleteTradeIn(id, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Az autó sikeresen törölve!"));
    }
}
