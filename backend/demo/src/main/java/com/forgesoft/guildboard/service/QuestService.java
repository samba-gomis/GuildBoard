package com.forgesoft.guildboard.service;

import com.forgesoft.guildboard.dto.AssignmentCreateRequest;
import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.dto.QuestCreateRequest;
import com.forgesoft.guildboard.dto.QuestResponse;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Difficulty;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.entity.QuestStatus;
import com.forgesoft.guildboard.exception.BusinessRuleException;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;
import com.forgesoft.guildboard.repository.QuestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final AdventurerRepository adventurerRepository;
    private final AssignmentRepository assignmentRepository;

    public QuestService(QuestRepository questRepository,
                         AdventurerRepository adventurerRepository,
                         AssignmentRepository assignmentRepository) {
        this.questRepository = questRepository;
        this.adventurerRepository = adventurerRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<QuestResponse> findAll(QuestStatus status, Difficulty difficulty) {
        List<Quest> quests;
        if (status != null && difficulty != null) {
            quests = questRepository.findByStatusAndDifficulty(status, difficulty);
        } else if (status != null) {
            quests = questRepository.findByStatus(status);
        } else if (difficulty != null) {
            quests = questRepository.findByDifficulty(difficulty);
        } else {
            quests = questRepository.findAll();
        }
        return quests.stream().map(this::toResponse).toList();
    }

    public QuestResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public QuestResponse create(QuestCreateRequest request) {
        if (questRepository.existsByTitle(request.title())) {
            throw new BusinessRuleException("TITLE_ALREADY_TAKEN", "Une quête intitulée \"" + request.title() + "\" existe déjà.");
        }
        Quest quest = new Quest(request.title(), request.description(), request.difficulty(),
                request.requiredLevel(), request.goldReward(), request.xpReward());
        return toResponse(questRepository.save(quest));
    }

    public QuestResponse update(Long id, QuestCreateRequest request) {
        Quest quest = getOrThrow(id);
        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new BusinessRuleException("QUEST_UPDATE_FORBIDDEN", "Impossible de modifier une quête en cours ou terminée.");
        }
        if (!quest.getTitle().equals(request.title()) && questRepository.existsByTitle(request.title())) {
            throw new BusinessRuleException("TITLE_ALREADY_TAKEN", "Une quête intitulée \"" + request.title() + "\" existe déjà.");
        }
        quest.setTitle(request.title());
        quest.setDescription(request.description());
        quest.setDifficulty(request.difficulty());
        quest.setRequiredLevel(request.requiredLevel());
        quest.setGoldReward(request.goldReward());
        quest.setXpReward(request.xpReward());
        return toResponse(questRepository.save(quest));
    }

    public void delete(Long id) {
        Quest quest = getOrThrow(id);
        if (quest.getStatus() == QuestStatus.ON_GOING) {
            throw new BusinessRuleException("QUEST_DELETE_FORBIDDEN", "Impossible de supprimer une quête en cours.");
        }
        questRepository.delete(quest);
    }

    public AssignmentResponse assign(Long questId, AssignmentCreateRequest request) {
        Quest quest = getOrThrow(questId);
        Adventurer adventurer = adventurerRepository.findById(request.adventurerId())
                .orElseThrow(() -> new ResourceNotFoundException("Aventurier introuvable (id=" + request.adventurerId() + ")."));

        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new BusinessRuleException("QUEST_NOT_AVAILABLE", "Cette quête n'est plus disponible.");
        }
        if (adventurer.getLevel() < quest.getRequiredLevel()) {
            throw new BusinessRuleException("LEVEL_TOO_LOW",
                    adventurer.getName() + " (niveau " + adventurer.getLevel() +
                            ") ne peut pas prendre une quête de niveau " + quest.getRequiredLevel() + ".");
        }
        if (assignmentRepository.findByAdventurerAndCompletedAtIsNull(adventurer).isPresent()) {
            throw new BusinessRuleException("ADVENTURER_ALREADY_BUSY", adventurer.getName() + " a déjà une quête en cours.");
        }

        Assignment assignment = new Assignment(adventurer, quest);
        quest.setStatus(QuestStatus.ON_GOING);
        questRepository.save(quest);
        return toResponse(assignmentRepository.save(assignment));
    }

    public AssignmentResponse complete(Long questId) {
        Quest quest = getOrThrow(questId);
        Assignment assignment = assignmentRepository.findByQuestAndCompletedAtIsNull(quest)
                .orElseThrow(() -> new BusinessRuleException("QUEST_NOT_ON_GOING", "Cette quête n'a pas d'assignation en cours à terminer."));

        Adventurer adventurer = assignment.getAdventurer();
        adventurer.setGold(adventurer.getGold() + quest.getGoldReward());

        int level = adventurer.getLevel();
        int xp = adventurer.getXp() + quest.getXpReward();
        while (xp >= level * 100) {
            xp -= level * 100;
            level++;
        }
        adventurer.setLevel(level);
        adventurer.setXp(xp);
        adventurerRepository.save(adventurer);

        assignment.setCompletedAt(LocalDateTime.now());
        quest.setStatus(QuestStatus.COMPLETED);
        questRepository.save(quest);

        return toResponse(assignmentRepository.save(assignment));
    }

    private Quest getOrThrow(Long id) {
        return questRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quête introuvable (id=" + id + ")."));
    }

    private QuestResponse toResponse(Quest quest) {
        return new QuestResponse(
                quest.getId(),
                quest.getTitle(),
                quest.getDescription(),
                quest.getDifficulty(),
                quest.getRequiredLevel(),
                quest.getGoldReward(),
                quest.getXpReward(),
                quest.getStatus()
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
