package com.forgesoft.guildboard.repository;

import com.forgesoft.guildboard.entity.Difficulty;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.entity.QuestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestRepository extends JpaRepository<Quest, Long> {

    List<Quest> findByStatus(QuestStatus status);

    List<Quest> findByDifficulty(Difficulty difficulty);

    List<Quest> findByStatusAndDifficulty(QuestStatus status, Difficulty difficulty);
}
