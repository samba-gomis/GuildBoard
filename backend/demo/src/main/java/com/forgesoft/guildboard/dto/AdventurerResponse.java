package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.entity.CharacterClass;

public record AdventurerResponse(
        Long id,
        String name,
        CharacterClass characterClass,
        Integer level,
        Integer xp,
        Integer gold
) {
}
