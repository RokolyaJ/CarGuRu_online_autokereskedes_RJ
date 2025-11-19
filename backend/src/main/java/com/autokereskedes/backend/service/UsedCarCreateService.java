package com.autokereskedes.backend.service;

import com.autokereskedes.backend.dto.*;
import com.autokereskedes.backend.model.*;
import com.autokereskedes.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsedCarCreateService {

    private final UsedCarRepository carRepo;
    private final UsedCarFeaturesRepository featuresRepo;
    private final UserRepository userRepo;
     private final EngineRepository engineRepo;
    

    @Transactional
    public Long createCar(UsedCarCreateRequest request, Long ownerId) {

        User owner = userRepo.findById(ownerId).orElseThrow();

        UsedCarCreateDto d = request.getCar();
        UsedCar car = new UsedCar();

        car.setBrand(d.getBrand());
        car.setModel(d.getModel());
        car.setYear(d.getYear());
        car.setPrice(d.getPrice());
        car.setMileage(d.getMileage());
        car.setFuel(d.getFuel());
        car.setEngineSize(d.getEngineSize());
        car.setTransmission(d.getTransmission());
        car.setBodyType(d.getBodyType());
        car.setCondition(d.getCondition());
        car.setDoors(d.getDoors());
        car.setSeats(d.getSeats());
        car.setTrunkCapacity(d.getTrunkCapacity());
        car.setDrivetrain(d.getDrivetrain());
        car.setEngineLayout(d.getEngineLayout());
        car.setKlimaType(d.getKlimaType());
        car.setDocs(d.getDocs());
        car.setTireSize(d.getTireSize());
        car.setLocation(d.getLocation());
        car.setDealer(d.getDealer());
        car.setDescription(d.getDescription());

        car.setOwner(owner);
if (d.getEngineId() != null) {
    Engine engine = engineRepo.findById(d.getEngineId())
            .orElseThrow(() -> new RuntimeException("Motor nem található: " + d.getEngineId()));
    car.setEngine(engine);
}
        car = carRepo.saveAndFlush(car);

        if (request.getFeatures() != null) {
            UsedCarFeaturesCreateDto x = request.getFeatures();
            UsedCarFeatures f = new UsedCarFeatures();
            f.setCar(car);
            f.setDontheto_ules(x.isDontheto_ules());
            f.setFutheto_ules(x.isFutheto_ules());
            f.setUlesmagassag(x.isUlesmagassag());
            f.setMultikormany(x.isMultikormany());
            f.setDerektamasz(x.isDerektamasz());
            f.setBorkormany(x.isBorkormany());
            f.setFuggoleges_legzsak(x.isFuggoleges_legzsak());
            f.setHatso_oldal_legzsak(x.isHatso_oldal_legzsak());
            f.setIsofix(x.isIsofix());
            f.setKikapcsolhato_legzsak(x.isKikapcsolhato_legzsak());
            f.setOldalso_legzsak(x.isOldalso_legzsak());
            f.setUtas_legzsak(x.isUtas_legzsak());
            f.setVezeto_legzsak(x.isVezeto_legzsak());
            f.setTerd_legzsak(x.isTerd_legzsak());
            f.setKozepso_legzsak(x.isKozepso_legzsak());
            f.setAllithato_kormany(x.isAllithato_kormany());
            f.setFedelzeti_komputer(x.isFedelzeti_komputer());
            f.setAbs(x.isAbs());
            f.setAsr(x.isAsr());
            f.setEsp(x.isEsp());
            f.setSavtarto(x.isSavtarto());
            f.setGuminyomas_ellenorzo(x.isGuminyomas_ellenorzo());
            f.setTavolsagtarto_tempomat(x.isTavolsagtarto_tempomat());
            f.setVeszfek(x.isVeszfek());
            f.setSzervokormany(x.isSzervokormany());
            f.setSebessegfuggo_szervokormany(x.isSebessegfuggo_szervokormany());
            f.setCentralzar(x.isCentralzar());
            f.setTolatokamera(x.isTolatokamera());
            f.setKodlampa(x.isKodlampa());
            f.setMenetfeny(x.isMenetfeny());
            f.setElektromos_ablak_elol(x.isElektromos_ablak_elol());
            f.setElektromos_ablak_hatul(x.isElektromos_ablak_hatul());
            f.setElektromos_tukor(x.isElektromos_tukor());
            f.setRadio(x.isRadio());
            f.setBluetooth(x.isBluetooth());
            f.setErintokijelzo(x.isErintokijelzo());
            f.setHangszoro6(x.isHangszoro6());
            f.setMultikijelzo(x.isMultikijelzo());
            f.setKormany_hifi(x.isKormany_hifi());

            featuresRepo.save(f);
        }

        return car.getId();
    }

}
