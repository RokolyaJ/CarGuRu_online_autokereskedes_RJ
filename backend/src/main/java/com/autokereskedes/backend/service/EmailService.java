package com.autokereskedes.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

@Value("${RESEND_API_KEY:dummy}")
    private String apiKey;

    @Value("${app.mail.from}")
    private String from;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOfferEmail(String to, String subject, String htmlContent, byte[] pdfBytes, String pdfFileName) {

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> attachment = null;
        if (pdfBytes != null && pdfBytes.length > 0) {
            attachment = Map.of(
                    "filename", pdfFileName,
                    "content", Base64.getEncoder().encodeToString(pdfBytes),
                    "contentType", "application/pdf"
            );
        }

        Map<String, Object> body = Map.of(
                "from", from,
                "to", List.of(to),
                "subject", subject,
                "html", htmlContent,
                "attachments", attachment != null ? List.of(attachment) : List.of()
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, request, String.class);
    }
}
