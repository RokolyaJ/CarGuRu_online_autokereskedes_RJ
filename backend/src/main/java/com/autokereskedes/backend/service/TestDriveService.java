package com.autokereskedes.backend.service;

import com.autokereskedes.backend.dto.TestDriveRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TestDriveService {

    @Value("${RESEND_API_KEY:dummy}")
    private String apiKey;

    @Value("${app.mail.from}")
    private String from;

    private final RestTemplate restTemplate = new RestTemplate();

    public void createBooking(TestDriveRequestDto request) {
        sendEmail(request);
    }

    private void sendEmail(TestDriveRequestDto req) {

        String url = "https://api.resend.com/emails";

        String carName = String.format("%s %s %s",
                req.getBrand() != null ? req.getBrand() : "",
                req.getModel() != null ? req.getModel() : "",
                req.getVariant() != null ? req.getVariant() : ""
        ).trim();

        String textBody = """
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
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "from", from,
                "to", List.of(req.getEmail()),
                "subject", "Tesztvezetés visszaigazolás",
                "text", textBody
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, request, String.class);
    }
}
