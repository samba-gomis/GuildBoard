import type { CharacterClass } from "../types/adventurer";
import type { DifficultyClass, StatusClass } from "../types/quest";

export const DIFFICULTY_LABELS: Record<DifficultyClass, string> = {
    EASY: "Facile",
    MEDIUM: "Moyen",
    HARD: "Difficile",
    EPIC: "Épique",
};

export const STATUS_LABELS: Record<StatusClass, string> = {
    AVAILABLE: "Disponible",
    ON_GOING: "En cours",
    COMPLETED: "Terminée",
};

export const CLASS_LABELS: Record<CharacterClass, string> = {
    WARRIOR: "Guerrier",
    MAGE: "Mage",
    RANGER: "Rôdeur",
    CLERIC: "Clerc",
};

export const DIFFICULTIES: DifficultyClass[] = ["EASY", "MEDIUM", "HARD", "EPIC"];

export const CHARACTER_CLASSES: CharacterClass[] = ["WARRIOR", "MAGE", "RANGER", "CLERIC"];

export function difficultyBanner(difficulty: DifficultyClass): string {
    return `/images/banner-${difficulty.toLowerCase()}.jpg`;
}

export function classPortrait(characterClass: CharacterClass): string {
    return `/images/class-${characterClass.toLowerCase()}.jpg`;
}

export function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("fr-FR");
}
