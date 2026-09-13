package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.entity.Difficulty;

public record QuestCreateRequest(
        String title,
        String description,
        Difficulty difficulty,
        Integer requiredLevel,
        Integer goldReward,
        Integer xpReward
) {
}
