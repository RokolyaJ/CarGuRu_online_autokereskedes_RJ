package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.PaymentInfo;
import com.autokereskedes.backend.service.PaymentInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paymentinfo")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentInfoController {

    private final PaymentInfoService service;

    @PostMapping("/save")
    public ResponseEntity<PaymentInfo> savePayment(@RequestParam Long userId,
                                                   @RequestParam String cardName,
                                                   @RequestParam String cardNumber,
                                                   @RequestParam String cardExpiry,
                                                   @RequestParam String cardCvv) {
        PaymentInfo info = new PaymentInfo();
        info.setUserId(userId);
        info.setCardName(cardName);
        info.setCardNumber(cardNumber);
        info.setCardExpiry(cardExpiry);
        info.setCardCvv(cardCvv);
        return ResponseEntity.ok(service.saveOrUpdate(info));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getUserPayment(@RequestParam Long userId) {
        return ResponseEntity.of(service.getUserPaymentInfo(userId));
    }
}
