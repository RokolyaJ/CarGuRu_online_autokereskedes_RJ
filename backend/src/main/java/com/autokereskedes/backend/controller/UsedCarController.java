package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.*;
import com.autokereskedes.backend.model.UsedCar;
import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.service.UsedCarCreateService;
import com.autokereskedes.backend.service.UsedCarReservationService;
import com.autokereskedes.backend.service.UsedCarService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usedcars")
@RequiredArgsConstructor
public class UsedCarController {

    private final UsedCarService service;
    private final UsedCarCreateService createService;
    private final UsedCarReservationService reservationService;

    @GetMapping("/brands")
    public List<String> brands() { return service.brands(); }

    @GetMapping("/models")
    public List<String> models(@RequestParam String brand) { return service.models(brand); }

    @GetMapping("/bodies")
    public List<String> bodies() { return service.bodies(); }

    @GetMapping("/fuels")
    public List<String> fuels() { return service.fuels(); }

    @GetMapping("/conditions")
    public List<String> conditions() { return service.conditions(); }

    @GetMapping("/doors")
    public List<Integer> doors() { return service.doors(); }

    @GetMapping("/seats")
    public List<Integer> seats() { return service.seats(); }


    @PostMapping("/search")
    public List<UsedCarListItemDto> search(@RequestBody UsedCarFilterDto filter) {
        return service.search(filter);
    }

    @GetMapping("/featured")
    public List<UsedCarListItemDto> featured() {
        return service.featured();
    }

    @GetMapping("/{id}")
    public UsedCarDetailDto getDetails(@PathVariable Long id,
                                       @AuthenticationPrincipal User user) {

        Long userId = (user != null ? user.getId() : null);
        boolean isAdmin = (user != null && user.getRole() == User.Role.ADMIN);

        return service.details(id, userId, isAdmin);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> createUsedCar(
            @RequestBody UsedCarCreateRequest request,
            @AuthenticationPrincipal User user
    ) {
        Long newCarId = createService.createCar(request, user.getId());
        return ResponseEntity.ok(Map.of("id", newCarId));
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public List<UsedCarListItemDto> mine(@AuthenticationPrincipal User user) {
        return service.myListings(user.getId());
    }


    @GetMapping("/admin/listings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsedCarAdminResponse>> adminListings() {

        List<UsedCarDetailDto> cars = service.getAllCarsForAdmin();

        Map<Long, List<UsedCarAdminDto>> grouped = cars.stream()
                .collect(Collectors.groupingBy(
                        UsedCarDetailDto::getOwnerId,
                        Collectors.mapping(car ->
                                new UsedCarAdminDto(
                                        car.getId(),
                                        car.getBrand(),
                                        car.getModel(),
                                        car.getYear(),
                                        car.getFuel(),
                                        car.getPrice(),
                                        (car.getImages() != null && !car.getImages().isEmpty())
                                                ? car.getImages().get(0)
                                                : "/placeholder.png"
                                ), Collectors.toList())
                ));

        List<UsedCarAdminResponse> response = grouped.entrySet().stream()
                .map(entry -> {
                    Long userId = entry.getKey();
                    String fullName = service.getUserFullName(userId);
                    return new UsedCarAdminResponse(
                            userId,
                            fullName,
                            entry.getValue()
                    );
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody UsedCarUpdateRequest req,
            @AuthenticationPrincipal User user
    ) {
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        service.updateCar(id, req, user.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        service.deleteListing(id, user.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/engines")
    public List<String> engines(
            @RequestParam String brand,
            @RequestParam String model
    ) {
        return service.engines(brand, model);
    }

    @PostMapping("/{id}/reserve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> reserve(@PathVariable Long id,
                                     @AuthenticationPrincipal User user) {
        reservationService.reserve(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/reserve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id,
                                               @AuthenticationPrincipal User user) {
        reservationService.cancelReservation(id, user.getId());
        return ResponseEntity.ok().build();
    }


    @GetMapping("/my-reservations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UsedCarListItemDto>> getMyReservations(
            @AuthenticationPrincipal User user
    ) {
        Long userId = user.getId();

        List<UsedCar> cars = reservationService.getMyReservedCars(userId);

        List<UsedCarListItemDto> dtos = cars.stream()
                .map(service::toListDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }
}
