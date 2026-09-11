package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.entity.CharacterClass;

public record AdventurerCreateRequest(String name, CharacterClass characterClass) {
}
