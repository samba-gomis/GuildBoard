package com.forgesoft.guildboard.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "adventurer_id", nullable = false)
    private Adventurer adventurer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "quest_id", nullable = false)
    private Quest quest;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    // Stays null until the quest is completed (see RG3)
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // JPA requires a no-arg constructor
    public Assignment() {
    }

    public Assignment(Adventurer adventurer, Quest quest) {
        this.adventurer = adventurer;
        this.quest = quest;
        this.assignedAt = LocalDateTime.now();
    }

    // Getters / Setters (no Lombok, written by hand)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Adventurer getAdventurer() {
        return adventurer;
    }

    public void setAdventurer(Adventurer adventurer) {
        this.adventurer = adventurer;
    }

    public Quest getQuest() {
        return quest;
    }

    public void setQuest(Quest quest) {
        this.quest = quest;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}