package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "user_document")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    private String status = "PENDING";

    @Column(name = "uploaded_at")
    private OffsetDateTime uploadedAt = OffsetDateTime.now();
}
