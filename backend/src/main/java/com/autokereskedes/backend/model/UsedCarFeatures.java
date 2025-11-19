package com.autokereskedes.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "usedcar_features")
public class UsedCarFeatures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "car_id", nullable = false, unique = true)
    private UsedCar car;
    private boolean dontheto_ules;
    private boolean futheto_ules;
    private boolean ulesmagassag;
    private boolean multikormany;
    private boolean derektamasz;
    private boolean borkormany;
    private boolean fuggoleges_legzsak;
    private boolean hatso_oldal_legzsak;
    private boolean isofix;
    private boolean kikapcsolhato_legzsak;
    private boolean oldalso_legzsak;
    private boolean utas_legzsak;
    private boolean vezeto_legzsak;
    private boolean terd_legzsak;
    private boolean kozepso_legzsak;
    private boolean allithato_kormany;
    private boolean fedelzeti_komputer;
    private boolean tolatokamera;
    private boolean abs;
    private boolean asr;
    private boolean esp;
    private boolean savtarto;
    private boolean guminyomas_ellenorzo;
    private boolean tavolsagtarto_tempomat;
    private boolean veszfek;
    private boolean szervokormany;
    private boolean sebessegfuggo_szervokormany;
    private boolean centralzar;
    private boolean kodlampa;
    private boolean menetfeny;
    private boolean elektromos_ablak_elol;
    private boolean elektromos_ablak_hatul;
    private boolean elektromos_tukor;
    private boolean radio;
    private boolean bluetooth;
    private boolean erintokijelzo;
    private boolean hangszoro6;
    private boolean multikijelzo;
    private boolean kormany_hifi;
}
    