package com.forgesoft.guildboard.repository;

import com.forgesoft.guildboard.entity.Adventurer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdventurerRepository extends JpaRepository<Adventurer, Long> {

    Optional<Adventurer> findByName(String name);

    List<Adventurer> findByBannedAtIsNull();

    List<Adventurer> findByNameContainingIgnoreCase(String name);
}
