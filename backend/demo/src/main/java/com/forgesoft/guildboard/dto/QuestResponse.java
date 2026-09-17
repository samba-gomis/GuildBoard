package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.entity.Difficulty;
import com.forgesoft.guildboard.entity.QuestStatus;

public record QuestResponse(
        Long id,
        String title,
        String description,
        Difficulty difficulty,
        Integer requiredLevel,
        Integer goldReward,
        Integer xpReward,
        QuestStatus status
) {
}
