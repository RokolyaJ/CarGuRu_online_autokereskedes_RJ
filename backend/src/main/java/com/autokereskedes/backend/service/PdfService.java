package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.OfferRequest;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateOfferPdf(OfferRequest req) throws Exception {
        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        document.add(new Paragraph("Ajánlatkérés", titleFont));
        document.add(new Paragraph("Dátum: " +
                req.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd. HH:mm")), textFont));
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Megszólítás: " + req.getMegszolitas(), textFont));
        document.add(new Paragraph("Név: " + req.getVezeteknev() + " " + req.getKeresztnev(), textFont));
        document.add(new Paragraph("Telefon: " + req.getPhone(), textFont));
        document.add(new Paragraph("Email: " + req.getEmail(), textFont));

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Cím:", textFont));
        document.add(new Paragraph(
                (req.getIranyitoszam() != null ? req.getIranyitoszam() : "") + " " +
                (req.getTelepules() != null ? req.getTelepules() : "") + ", " +
                (req.getUtca() != null ? req.getUtca() : "") + " " +
                (req.getHazszam() != null ? req.getHazszam() : ""), textFont
        ));

        document.add(Chunk.NEWLINE);
        document.add(new Paragraph("Kereskedő: " + req.getDealer(), textFont));
        document.add(new Paragraph("VIN: " + req.getVin(), textFont));
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Üzenet:", textFont));
        document.add(new Paragraph(req.getMessage() != null ? req.getMessage() : "-", textFont));

        document.close();
        return baos.toByteArray();
    }
}
