package com.autokereskedes.backend.controller;
import com.autokereskedes.backend.model.Configuration;
import com.autokereskedes.backend.repository.ConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/configuration")
@CrossOrigin
public class ConfigurationController {
    @Autowired
    private ConfigurationRepository configurationRepository;
    @PostMapping
    public Configuration saveConfiguration(@RequestBody Configuration config) {
        return configurationRepository.save(config);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Configuration> getConfiguration(@PathVariable Long id) {
        return configurationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
