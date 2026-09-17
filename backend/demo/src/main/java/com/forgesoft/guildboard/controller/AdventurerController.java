package com.forgesoft.guildboard.controller;

import com.forgesoft.guildboard.dto.AdventurerCreateRequest;
import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.service.AdventurerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adventurers")
public class AdventurerController {

    private final AdventurerService adventurerService;

    public AdventurerController(AdventurerService adventurerService) {
        this.adventurerService = adventurerService;
    }

    @GetMapping
    public ResponseEntity<List<AdventurerResponse>> findAll() {
        return ResponseEntity.ok(adventurerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdventurerResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(adventurerService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AdventurerResponse> create(@Valid @RequestBody AdventurerCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adventurerService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdventurerResponse> update(@PathVariable Long id, @Valid @RequestBody AdventurerCreateRequest request) {
        return ResponseEntity.ok(adventurerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adventurerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<AssignmentResponse>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(adventurerService.getHistory(id));
    }
}
