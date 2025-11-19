package com.autokereskedes.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trade_in_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"tradeIn"})
public class TradeInImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trade_in_id")
    private TradeIn tradeIn;

    @Column(columnDefinition = "text")
    private String url;

    @Column(name = "is_main")
    private Boolean isMain = false;
}
