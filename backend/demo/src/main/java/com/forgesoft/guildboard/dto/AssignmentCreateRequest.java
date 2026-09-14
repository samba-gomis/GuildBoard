package com.forgesoft.guildboard.dto;

import jakarta.validation.constraints.NotNull;

public record AssignmentCreateRequest(@NotNull Long adventurerId) {
}
