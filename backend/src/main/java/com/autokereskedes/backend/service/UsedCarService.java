package com.autokereskedes.backend.service;

import com.autokereskedes.backend.dto.*;
import com.autokereskedes.backend.model.UsedCar;
import com.autokereskedes.backend.model.UsedCarFeatures;
import com.autokereskedes.backend.model.UsedCarSpecs;
import com.autokereskedes.backend.model.User;

import com.autokereskedes.backend.repository.EngineRepository;
import com.autokereskedes.backend.repository.UsedCarFeaturesRepository;
import com.autokereskedes.backend.repository.UsedCarRepository;
import com.autokereskedes.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsedCarService {

    private final UsedCarRepository repo;
    private final UsedCarFeaturesRepository featRepo;
    private final EngineRepository engineRepo;
    private final UserRepository userRepository;
    private final UsedCarReservationService reservationService;
    public List<String> brands() { return repo.distinctBrands(); }
    public List<String> models(String brand) { return repo.distinctModels(brand); }
    public List<String> bodies() { return repo.distinctBodies(); }
    public List<String> fuels() { return repo.distinctFuels(); }
    public List<String> conditions() { return repo.distinctConditions(); }
    public List<Integer> doors() { return repo.distinctDoors(); }
    public List<Integer> seats() { return repo.distinctSeats(); }
    public List<UsedCarListItemDto> search(UsedCarFilterDto filter) {
        Specification<UsedCar> spec = UsedCarSpecs.byFilter(filter);

        Pageable pageable = PageRequest.of(
                0,
                Integer.MAX_VALUE,
                Sort.by(Sort.Direction.DESC, "id")
        );

        return repo.findAll(spec, pageable).stream()
        .map(this::toListDto)  
        .toList();
    }
    public List<UsedCarListItemDto> featured() {
        Pageable pageable = PageRequest.of(0, 12, Sort.by(Sort.Direction.DESC, "id"));

        return repo.findAll(pageable).stream()
                .map(this::toListDto)
                .toList();
    }
    public UsedCarDetailDto details(Long id, Long userId, boolean isAdmin) {

    UsedCar car = repo.findById(id)
            .orElseThrow(() -> new NoSuchElementException("A megadott autó nem található."));
    User owner = car.getOwner();
    Long sellerId = owner != null ? owner.getId() : null;
    String sellerName = owner != null
            ? owner.getFirstName() + " " + owner.getLastName()
            : null;
    List<String> images = repo.imagesFor(id);
    if (images == null || images.isEmpty()) {
        images = List.of("http://localhost:8080/uploads/placeholder.png");
    } else {
        String base = "http://localhost:8080";
        images = images.stream().map(path -> {
            if (path == null || path.isBlank()) {
                return base + "/uploads/placeholder.png";
            }
            if (!path.startsWith("http")) {
                if (!path.startsWith("/")) path = "/" + path;
                if (!path.contains("/uploads/")) {
                    path = "/uploads/usedcars/" + id + path;
                }
                path = base + path;
            }
            return path;
        }).toList();
    }

    UsedCarFeaturesDto featuresDto = featRepo.findByCar_Id(id)
            .map(this::mapFeatures)
            .orElseGet(UsedCarFeaturesDto::new);
    var reservationOpt = reservationService.findActiveReservationForCar(id);

    boolean reserved = reservationOpt.isPresent();
    Long reservedById = reservationOpt.map(r -> r.getUser().getId()).orElse(null);
    String reservedBy = reservationOpt
            .map(r -> r.getUser().getFirstName() + " " + r.getUser().getLastName())
            .orElse(null);
    boolean userHasReserved = (reservedById != null && reservedById.equals(userId));
    return new UsedCarDetailDto(
        car.getId(),
        owner != null ? owner.getId() : null,

        car.getBrand(),
        car.getModel(),
        car.getEngine() != null ? car.getEngine().getName() : null,
        car.getYear(),
        car.getPrice(),
        car.getMileage(),
        car.getFuel(),
        car.getTransmission(),
        car.getBodyType(),
        car.getCondition(),

        car.getDoors(),
        car.getSeats(),
        car.getTrunkCapacity(),
        car.getEngineSize(),
        car.getWeight(),
        car.getTotalWeight(),
        car.getKlimaType(),
        car.getEngineLayout(),
        car.getDrivetrain(),
        car.getDocs(),
        car.getTireSize(),

        car.getLocation(),
        car.getDealer(),
        car.getDescription(),

        images,
        featuresDto,

        reserved,
        reservedBy,
        reservedById,
        userHasReserved,

        sellerId,    
        sellerName
);

}
    private UsedCarFeaturesDto mapFeatures(UsedCarFeatures f) {
        UsedCarFeaturesDto d = new UsedCarFeaturesDto();

        d.setDontheto_ules(f.isDontheto_ules());
        d.setFutheto_ules(f.isFutheto_ules());
        d.setUlesmagassag(f.isUlesmagassag());
        d.setMultikormany(f.isMultikormany());
        d.setDerektamasz(f.isDerektamasz());
        d.setBorkormany(f.isBorkormany());
        d.setFuggoleges_legzsak(f.isFuggoleges_legzsak());
        d.setHatso_oldal_legzsak(f.isHatso_oldal_legzsak());
        d.setIsofix(f.isIsofix());
        d.setKikapcsolhato_legzsak(f.isKikapcsolhato_legzsak());
        d.setOldalso_legzsak(f.isOldalso_legzsak());
        d.setUtas_legzsak(f.isUtas_legzsak());
        d.setVezeto_legzsak(f.isVezeto_legzsak());
        d.setTerd_legzsak(f.isTerd_legzsak());
        d.setKozepso_legzsak(f.isKozepso_legzsak());
        d.setAllithato_kormany(f.isAllithato_kormany());
        d.setFedelzeti_komputer(f.isFedelzeti_komputer());

        d.setTolatokamera(f.isTolatokamera());
        d.setAbs(f.isAbs());
        d.setAsr(f.isAsr());
        d.setEsp(f.isEsp());
        d.setSavtarto(f.isSavtarto());
        d.setGuminyomas_ellenorzo(f.isGuminyomas_ellenorzo());
        d.setTavolsagtarto_tempomat(f.isTavolsagtarto_tempomat());
        d.setVeszfek(f.isVeszfek());
        d.setSzervokormany(f.isSzervokormany());
        d.setSebessegfuggo_szervokormany(f.isSebessegfuggo_szervokormany());
        d.setCentralzar(f.isCentralzar());

        d.setKodlampa(f.isKodlampa());
        d.setMenetfeny(f.isMenetfeny());
        d.setElektromos_ablak_elol(f.isElektromos_ablak_elol());
        d.setElektromos_ablak_hatul(f.isElektromos_ablak_hatul());
        d.setElektromos_tukor(f.isElektromos_tukor());

        d.setRadio(f.isRadio());
        d.setBluetooth(f.isBluetooth());
        d.setErintokijelzo(f.isErintokijelzo());
        d.setHangszoro6(f.isHangszoro6());
        d.setMultikijelzo(f.isMultikijelzo());
        d.setKormany_hifi(f.isKormany_hifi());

        return d;
    }
    private String safeFirstImage(Long id) {
        String url = repo.firstImageFor(id);

        if (url == null || url.isBlank()) {
            return "http://localhost:8080/uploads/placeholder.png";
        }

        if (!url.startsWith("http")) {
            if (!url.startsWith("/")) url = "/" + url;
            if (!url.contains("/uploads/")) {
                url = "/uploads/usedcars/" + id + url;
            }
            url = "http://localhost:8080" + url;
        }

        return url;
    }
    public List<String> engines(String brand, String model) {
        return engineRepo.findEngineNames(brand, model);
    }
    public List<UsedCarListItemDto> myListings(Long userId) {
        return repo.findByOwner_Id(userId).stream()
                .map(this::toListDto)
                .toList();
    }
    public Map<Long, List<UsedCarListItemDto>> adminListingsGrouped() {
        return repo.findAll().stream()
                .collect(Collectors.groupingBy(
                        c -> c.getOwner().getId(),
                        Collectors.mapping(this::toListDto, Collectors.toList())
                ));
    }
    public void deleteListing(Long id, Long requesterId, boolean isAdmin) {
        var car = repo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Hirdetés nem található"));

        if (!isAdmin && !car.getOwner().getId().equals(requesterId)) {
            throw new AccessDeniedException("Nincs jogosultság törölni ezt a hirdetést");
        }

        repo.delete(car);
    }
    @Transactional
    public void updateCar(Long id, UsedCarUpdateRequest req, Long userId, boolean isAdmin) {
        UsedCar car = repo.findById(id).orElseThrow();

        if (!isAdmin && !car.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("Nincs jogosultság.");
        }

        if (req.getBrand() != null) car.setBrand(req.getBrand());
        if (req.getModel() != null) car.setModel(req.getModel());
        if (req.getYear() != null) car.setYear(req.getYear());
        if (req.getPrice() != null) car.setPrice(req.getPrice());
        if (req.getMileage() != null) car.setMileage(req.getMileage());
        if (req.getFuel() != null) car.setFuel(req.getFuel());
        if (req.getEngineSize() != null) car.setEngineSize(req.getEngineSize());
        if (req.getTransmission() != null) car.setTransmission(req.getTransmission());
        if (req.getBodyType() != null) car.setBodyType(req.getBodyType());
        if (req.getCondition() != null) car.setCondition(req.getCondition());
        if (req.getDoors() != null) car.setDoors(req.getDoors());
        if (req.getSeats() != null) car.setSeats(req.getSeats());
        if (req.getTrunkCapacity() != null) car.setTrunkCapacity(req.getTrunkCapacity());
        if (req.getDrivetrain() != null) car.setDrivetrain(req.getDrivetrain());
        if (req.getEngineLayout() != null) car.setEngineLayout(req.getEngineLayout());
        if (req.getKlimaType() != null) car.setKlimaType(req.getKlimaType());
        if (req.getDocs() != null) car.setDocs(req.getDocs());
        if (req.getTireSize() != null) car.setTireSize(req.getTireSize());
        if (req.getLocation() != null) car.setLocation(req.getLocation());
        if (req.getDealer() != null) car.setDealer(req.getDealer());
        if (req.getDescription() != null) car.setDescription(req.getDescription());

        repo.save(car);
    }
    public Long findUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Nem található felhasználó ezzel az e-mail címmel: " + email));
    }
    public List<UsedCarDetailDto> getAllCarsForAdmin() {
        return repo.findAll().stream()
                .map(car -> details(car.getId(), null, true))
                .collect(Collectors.toList());
    }
    public List<UsedCarAdminResponse> getAdminListingWithUserNames() {

        List<UsedCarDetailDto> cars = getAllCarsForAdmin();

        Map<Long, List<UsedCarAdminDto>> grouped = cars.stream()
                .collect(Collectors.groupingBy(
                        UsedCarDetailDto::getOwnerId,
                        Collectors.mapping(c ->
                                new UsedCarAdminDto(
                                        c.getId(),
                                        c.getBrand(),
                                        c.getModel(),
                                        c.getYear(),
                                        c.getFuel(),
                                        c.getPrice(),
                                        c.getImages() != null && !c.getImages().isEmpty()
                                                ? c.getImages().get(0)
                                                : "/placeholder.png"
                                ), Collectors.toList())
                ));

        return grouped.entrySet().stream()
                .map(entry -> {
                    Long userId = entry.getKey();
                    var user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("Felhasználó nem található."));

                    String fullName = user.getFirstName() + " " + user.getLastName();

                    return new UsedCarAdminResponse(
                            userId,
                            fullName,
                            entry.getValue()
                    );
                })
                .toList();
    }
    public String getUserFullName(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található: " + userId));

        return user.getFirstName() + " " + user.getLastName();
    }
   public UsedCarListItemDto toListDto(UsedCar c) {
    boolean reserved = reservationService.findActiveReservationForCar(c.getId()).isPresent();

    return new UsedCarListItemDto(
            c.getId(),
            c.getBrand(),
            c.getModel(),
            c.getYear(),
            c.getMileage(),
            c.getPrice(),
            c.getFuel(),
            c.getBodyType(),
            safeFirstImage(c.getId()),
            reserved
    );
}

    

}
