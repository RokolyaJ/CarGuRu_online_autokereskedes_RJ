package com.autokereskedes.backend.service;

import com.autokereskedes.backend.dto.TestDriveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TestDriveService {

   private final JavaMailSender mailSender;

    public void createBooking(TestDriveRequestDto request) {
        sendEmail(request);
    }

    private void sendEmail(TestDriveRequestDto req) {

    String carName = String.format("%s %s %s",
            req.getBrand() != null ? req.getBrand() : "",
            req.getModel() != null ? req.getModel() : "",
            req.getVariant() != null ? req.getVariant() : ""
    ).trim();

    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setTo(req.getEmail());
    msg.setSubject("Tesztvezetés visszaigazolás");

    msg.setText("""
            Tisztelt %s!

            Köszönjük, hogy tesztvezetésre jelentkezett.

            Autó: %s
            Ár: %s Ft
            Üzemanyag: %s | Teljesítmény: %s LE | Váltó: %s

            Dátum: %s
            Az autót ezen a napon 08:00 és 11:00 között tudja átvenni.
            Helyszín: %s (%s)

            Üdvözlettel:
            CarGuru Kft.
            """.formatted(
            req.getFullName(),
            carName,                
            req.getPrice(),
            req.getFuel(),
            req.getPowerHp(),
            req.getTransmission(),
            req.getDate(),
            req.getStoreName(),
            req.getCity()
    ));

    mailSender.send(msg);
}


}
