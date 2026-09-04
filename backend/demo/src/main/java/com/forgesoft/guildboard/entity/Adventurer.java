package com.forgesoft.guildboard.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "adventurer")
public class Adventurer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "character_class", nullable = false)
    private CharacterClass characterClass;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(nullable = false)
    private Integer gold = 0;

    // JPA requires a no-arg constructor
    public Adventurer() {
    }

    public Adventurer(String name, CharacterClass characterClass) {
        this.name = name;
        this.characterClass = characterClass;
        this.level = 1;
        this.xp = 0;
        this.gold = 0;
    }

    // --- Getters / Setters (no Lombok, written by hand) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CharacterClass getCharacterClass() {
        return characterClass;
    }

    public void setCharacterClass(CharacterClass characterClass) {
        this.characterClass = characterClass;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
    }

    public Integer getGold() {
        return gold;
    }

    public void setGold(Integer gold) {
        this.gold = gold;
    }
}