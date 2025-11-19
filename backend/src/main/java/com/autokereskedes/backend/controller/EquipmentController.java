package com.autokereskedes.backend.controller;
import com.autokereskedes.backend.model.Equipment;
import com.autokereskedes.backend.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipmentController {
    @Autowired
    private EquipmentRepository equipmentRepository;
    @GetMapping("/brand/{brandId}")
    public List<Equipment> getEquipmentByBrand(@PathVariable Long brandId) {
        return equipmentRepository.findByBrandId(brandId);
    }
}
