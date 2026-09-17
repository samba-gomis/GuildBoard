package com.forgesoft.guildboard.service;

import com.forgesoft.guildboard.dto.AdventurerCreateRequest;
import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.exception.BusinessRuleException;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdventurerService {

    private final AdventurerRepository adventurerRepository;
    private final AssignmentRepository assignmentRepository;

    public AdventurerService(AdventurerRepository adventurerRepository, AssignmentRepository assignmentRepository) {
        this.adventurerRepository = adventurerRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<AdventurerResponse> findAll() {
        return adventurerRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AdventurerResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public AdventurerResponse create(AdventurerCreateRequest request) {
        if (adventurerRepository.existsByName(request.name())) {
            throw new BusinessRuleException("NAME_ALREADY_TAKEN", "Un aventurier nommé \"" + request.name() + "\" existe déjà.");
        }
        Adventurer adventurer = new Adventurer(request.name(), request.characterClass());
        return toResponse(adventurerRepository.save(adventurer));
    }

    public AdventurerResponse update(Long id, AdventurerCreateRequest request) {
        Adventurer adventurer = getOrThrow(id);
        if (!adventurer.getName().equals(request.name()) && adventurerRepository.existsByName(request.name())) {
            throw new BusinessRuleException("NAME_ALREADY_TAKEN", "Un aventurier nommé \"" + request.name() + "\" existe déjà.");
        }
        adventurer.setName(request.name());
        adventurer.setCharacterClass(request.characterClass());
        return toResponse(adventurerRepository.save(adventurer));
    }

    public void delete(Long id) {
        Adventurer adventurer = getOrThrow(id);
        adventurerRepository.delete(adventurer);
    }

    public List<AssignmentResponse> getHistory(Long id) {
        Adventurer adventurer = getOrThrow(id);
        return assignmentRepository.findByAdventurer(adventurer).stream()
                .map(this::toResponse)
                .toList();
    }

    private Adventurer getOrThrow(Long id) {
        return adventurerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aventurier introuvable (id=" + id + ")."));
    }

    private AdventurerResponse toResponse(Adventurer adventurer) {
        return new AdventurerResponse(
                adventurer.getId(),
                adventurer.getName(),
                adventurer.getCharacterClass(),
                adventurer.getLevel(),
                adventurer.getXp(),
                adventurer.getGold()
        );
    }

    private AssignmentResponse toResponse(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getAdventurer().getId(),
                assignment.getAdventurer().getName(),
                assignment.getQuest().getId(),
                assignment.getQuest().getTitle(),
                assignment.getAssignedAt(),
                assignment.getCompletedAt()
        );
    }
}
