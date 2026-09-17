package com.forgesoft.guildboard.controller;

import com.forgesoft.guildboard.dto.AssignmentCreateRequest;
import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.dto.QuestCreateRequest;
import com.forgesoft.guildboard.dto.QuestResponse;
import com.forgesoft.guildboard.entity.Difficulty;
import com.forgesoft.guildboard.entity.QuestStatus;
import com.forgesoft.guildboard.service.QuestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public ResponseEntity<List<QuestResponse>> findAll(
            @RequestParam(required = false) QuestStatus status,
            @RequestParam(required = false) Difficulty difficulty) {
        return ResponseEntity.ok(questService.findAll(status, difficulty));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(questService.findById(id));
    }

    @PostMapping
    public ResponseEntity<QuestResponse> create(@Valid @RequestBody QuestCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(questService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestResponse> update(@PathVariable Long id, @Valid @RequestBody QuestCreateRequest request) {
        return ResponseEntity.ok(questService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        questService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assignment")
    public ResponseEntity<AssignmentResponse> assign(@PathVariable Long id, @Valid @RequestBody AssignmentCreateRequest request) {
        return ResponseEntity.ok(questService.assign(id, request));
    }

    @PostMapping("/{id}/completion")
    public ResponseEntity<AssignmentResponse> complete(@PathVariable Long id) {
        return ResponseEntity.ok(questService.complete(id));
    }
}
