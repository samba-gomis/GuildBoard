package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.entity.Difficulty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record QuestCreateRequest(
        @NotBlank @Size(min = 5, max = 100) String title,
        @NotBlank @Size(min = 10, max = 500) String description,
        @NotNull Difficulty difficulty,
        @NotNull @Min(1) Integer requiredLevel,
        @NotNull @Min(0) Integer goldReward,
        @NotNull @Min(1) Integer xpReward
) {
}
