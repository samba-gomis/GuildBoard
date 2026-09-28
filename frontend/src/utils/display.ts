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

export const DIFFICULTIES: DifficultyClass[] = ["EASY", "MEDIUM", "HARD", "EPIC"];

export function difficultyBanner(difficulty: DifficultyClass): string {
    return `/images/banner-${difficulty.toLowerCase()}.jpg`;
}
