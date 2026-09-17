package com.forgesoft.guildboard.dto;

import java.time.LocalDateTime;

public record AssignmentResponse(
        Long id,
        Long adventurerId,
        String adventurerName,
        Long questId,
        String questTitle,
        LocalDateTime assignedAt,
        LocalDateTime completedAt
) {
}
