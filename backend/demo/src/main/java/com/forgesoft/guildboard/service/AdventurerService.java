package com.forgesoft.guildboard.service;

import com.forgesoft.guildboard.dto.AdventurerCreateRequest;
import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.entity.QuestStatus;
import com.forgesoft.guildboard.exception.BusinessRuleException;
import com.forgesoft.guildboard.exception.ResourceGoneException;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;
import com.forgesoft.guildboard.repository.QuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdventurerService {

    private final AdventurerRepository adventurerRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuestRepository questRepository;

    public AdventurerService(AdventurerRepository adventurerRepository,
                             AssignmentRepository assignmentRepository,
                             QuestRepository questRepository) {
        this.adventurerRepository = adventurerRepository;
        this.assignmentRepository = assignmentRepository;
        this.questRepository = questRepository;
    }

    // Without a search term only active adventurers are listed; a search also returns banned ones
    public List<AdventurerResponse> findAll(String search) {
        List<Adventurer> adventurers = (search == null || search.isBlank())
                ? adventurerRepository.findByBannedAtIsNull()
                : adventurerRepository.findByNameContainingIgnoreCase(search.trim());
        return adventurers.stream()
                .map(this::toResponse)
                .toList();
    }

    public AdventurerResponse findById(Long id) {
        return toResponse(getActiveOrThrow(id));
    }

    public AdventurerResponse create(AdventurerCreateRequest request) {
        adventurerRepository.findByName(request.name()).ifPresent(existing -> {
            throw nameTaken(existing);
        });
        Adventurer adventurer = new Adventurer(request.name(), request.characterClass());
        return toResponse(adventurerRepository.save(adventurer));
    }

    public AdventurerResponse update(Long id, AdventurerCreateRequest request) {
        Adventurer adventurer = getActiveOrThrow(id);
        if (!adventurer.getName().equals(request.name())) {
            adventurerRepository.findByName(request.name()).ifPresent(existing -> {
                throw nameTaken(existing);
            });
        }
        adventurer.setName(request.name());
        adventurer.setCharacterClass(request.characterClass());
        return toResponse(adventurerRepository.save(adventurer));
    }

    @Transactional
    public void ban(Long id) {
        Adventurer adventurer = getActiveOrThrow(id);
        assignmentRepository.findByAdventurerAndCompletedAtIsNull(adventurer).ifPresent(ongoing -> {
            Quest quest = ongoing.getQuest();
            quest.setStatus(QuestStatus.AVAILABLE);
            questRepository.save(quest);
            assignmentRepository.delete(ongoing);
        });
        adventurer.setBannedAt(LocalDateTime.now());
        adventurerRepository.save(adventurer);
    }

    public List<AssignmentResponse> getHistory(Long id) {
        Adventurer adventurer = getActiveOrThrow(id);
        return assignmentRepository.findByAdventurer(adventurer).stream()
                .map(this::toResponse)
                .toList();
    }

    private Adventurer getActiveOrThrow(Long id) {
        Adventurer adventurer = adventurerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aventurier introuvable (id=" + id + ")."));
        if (adventurer.isBanned()) {
            throw new ResourceGoneException("ADVENTURER_BANNED", adventurer.getName() + " a été banni de la guilde.");
        }
        return adventurer;
    }

    private BusinessRuleException nameTaken(Adventurer existing) {
        String message = existing.isBanned()
                ? "Le nom \"" + existing.getName() + "\" appartient à un aventurier banni de la guilde."
                : "Un aventurier nommé \"" + existing.getName() + "\" existe déjà.";
        return new BusinessRuleException("NAME_ALREADY_TAKEN", message);
    }

    private AdventurerResponse toResponse(Adventurer adventurer) {
        return new AdventurerResponse(
                adventurer.getId(),
                adventurer.getName(),
                adventurer.getCharacterClass(),
                adventurer.getLevel(),
                adventurer.getXp(),
                adventurer.getGold(),
                adventurer.isBanned()
        );
    }

    private AssignmentResponse toResponse(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getAdventurer().getId(),
                assignment.getAdventurer().getName(),
                assignment.getAdventurer().isBanned(),
                assignment.getQuest().getId(),
                assignment.getQuest().getTitle(),
                assignment.getAssignedAt(),
                assignment.getCompletedAt()
        );
    }
}
