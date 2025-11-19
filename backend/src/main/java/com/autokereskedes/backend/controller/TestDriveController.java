package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.dto.TestDriveRequestDto;
import com.autokereskedes.backend.service.TestDriveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-drive")
@RequiredArgsConstructor
public class TestDriveController {

   private final TestDriveService testDriveService;

    @PostMapping
    public ResponseEntity<String> bookTestDrive(@RequestBody TestDriveRequestDto request) {
        testDriveService.createBooking(request);
        return ResponseEntity.ok("Foglalás sikeres!");
    }
}
