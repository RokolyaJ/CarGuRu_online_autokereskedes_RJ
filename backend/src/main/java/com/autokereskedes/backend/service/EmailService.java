package com.autokereskedes.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOfferEmail(String to, String subject, String htmlContent, byte[] pdfBytes, String pdfFileName) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, "CarGuru Autókereskedés");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        if (pdfBytes != null && pdfBytes.length > 0) {
            helper.addAttachment(pdfFileName, new ByteArrayResource(pdfBytes));
        }

        mailSender.send(message);
    }
}
