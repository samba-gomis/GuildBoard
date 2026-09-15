package com.forgesoft.guildboard.repository;

import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Quest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByAdventurer(Adventurer adventurer);

    Optional<Assignment> findByAdventurerAndCompletedAtIsNull(Adventurer adventurer);

    Optional<Assignment> findByQuestAndCompletedAtIsNull(Quest quest);
}
