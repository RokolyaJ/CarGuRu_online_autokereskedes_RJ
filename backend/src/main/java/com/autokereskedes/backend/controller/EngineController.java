package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.EngineDto;
import com.autokereskedes.backend.repository.EngineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/engines")
@CrossOrigin
@RequiredArgsConstructor
public class EngineController {

    private final EngineRepository engineRepository;
    @GetMapping
    public List<EngineDto> getEngineNames(@RequestParam String brand,
                                          @RequestParam String model) {
        return engineRepository.findByBrandAndModel(brand, model)
                .stream()
                .map(e -> new EngineDto(e.getId(), e.getName()))
                .toList();
    }
}
