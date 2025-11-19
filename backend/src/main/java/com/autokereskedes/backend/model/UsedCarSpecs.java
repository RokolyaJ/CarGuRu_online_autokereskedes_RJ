package com.autokereskedes.backend.model;

import com.autokereskedes.backend.dto.UsedCarFilterDto;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UsedCarSpecs {

    public static Specification<UsedCar> byFilter(UsedCarFilterDto f) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (nz(f.getBrand())) p.add(cb.equal(root.get("brand"), f.getBrand()));
            if (nz(f.getModel())) p.add(cb.equal(root.get("model"), f.getModel()));
            if (nz(f.getBody()))  p.add(cb.equal(root.get("bodyType"), f.getBody()));
            if (nz(f.getFuel()))  p.add(cb.equal(root.get("fuel"), f.getFuel()));
            if (f.getYearFrom() != null) p.add(cb.greaterThanOrEqualTo(root.get("year"), f.getYearFrom()));
            if (f.getYearTo()   != null) p.add(cb.lessThanOrEqualTo(root.get("year"), f.getYearTo()));
            if (f.getPriceFrom() != null) p.add(cb.greaterThanOrEqualTo(root.get("price"), f.getPriceFrom()));
            if (f.getPriceTo()   != null) p.add(cb.lessThanOrEqualTo(root.get("price"), f.getPriceTo()));
            if (f.getMileageFrom() != null) p.add(cb.greaterThanOrEqualTo(root.get("mileage"), f.getMileageFrom()));
            if (f.getMileageTo()   != null) p.add(cb.lessThanOrEqualTo(root.get("mileage"), f.getMileageTo()));
            if (f.getEngineCcFrom() != null) p.add(cb.greaterThanOrEqualTo(root.get("engineSize"), f.getEngineCcFrom()));
            if (f.getEngineCcTo()   != null) p.add(cb.lessThanOrEqualTo(root.get("engineSize"), f.getEngineCcTo()));
            if (nz(f.getCondition())) p.add(cb.equal(root.get("condition"), f.getCondition()));
            if (f.getDoors() != null) p.add(cb.equal(root.get("doors"), f.getDoors()));
            if (f.getSeats() != null) p.add(cb.equal(root.get("seats"), f.getSeats()));
            if (tb(f.getAutomatic()))       p.add(cb.isTrue(root.get("automatic")));
            if (tb(f.getCruiseControl()))   p.add(cb.isTrue(root.get("cruiseControl")));
            if (tb(f.getAwd()))             p.add(cb.isTrue(root.get("awd")));
            if (tb(f.getAlloyWheels()))     p.add(cb.isTrue(root.get("alloyWheels")));
            if (tb(f.getElectricWindows())) p.add(cb.isTrue(root.get("electricWindows")));
            if (tb(f.getTowHook()))         p.add(cb.isTrue(root.get("towHook")));
            if (tb(f.getIsofix()))          p.add(cb.isTrue(root.get("isofix")));
            if (tb(f.getEsp()))             p.add(cb.isTrue(root.get("esp")));
            if (tb(f.getServiceBook()))     p.add(cb.isTrue(root.get("serviceBook")));
            if (tb(f.getVeteran()))         p.add(cb.isTrue(root.get("veteran")));
            if (tb(f.getIsNewOrDemo()))     p.add(cb.isTrue(root.get("isNewOrDemo")));
            if (tb(f.getHasWarranty()))     p.add(cb.isTrue(root.get("hasWarranty")));
            if (tb(f.getRentable()))        p.add(cb.isTrue(root.get("rentable")));
            if (tb(f.getHasDocuments()))    p.add(cb.isTrue(root.get("hasDocuments")));
            if (tb(f.getIsUsed()))          p.add(cb.isTrue(root.get("isUsed")));
            if (tb(f.getHistoryChecked()))  p.add(cb.isTrue(root.get("historyChecked")));
            if (tb(f.getAc()))              p.add(cb.isTrue(root.get("ac")));
            if (tb(f.getRegValidHu()))      p.add(cb.isTrue(root.get("regValidHu")));

            if (f.getEngineId() != null) {
                p.add(
                    cb.equal(root.join("engine", JoinType.LEFT).get("id"), f.getEngineId())
                );
            }

            return cb.and(p.toArray(new Predicate[0]));
        };
    }
    private static boolean nz(String s) { return s != null && !s.isBlank(); }
    private static boolean tb(Boolean b) { return b != null && b; }
}
