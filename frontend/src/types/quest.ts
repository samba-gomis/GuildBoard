export type DifficultyClass = "EASY" | "MEDIUM" | "HARD" | "EPIC";
export type StatusClass = "AVAILABLE" | "ON_GOING" | "COMPLETED";

export interface Quest {
    id: number;
    title: string;
    description: string;
    difficulty: DifficultyClass;
    requiredLevel: number;
    goldReward: number;
    xpReward: number;
    status: StatusClass;
}

export interface QuestCreateRequest {
    title: string;
    description: string;
    difficulty: DifficultyClass;
    requiredLevel: number;
    goldReward: number;
    xpReward: number;
}
