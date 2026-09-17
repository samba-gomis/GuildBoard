export type DifficultyClass = "EASY"|"MEDIUM"|"HARD"|"EPIC";
export type StatusClass ="AVAILABLE"|"ON_GOING"|"COMPLETED";
export interface Quest {
    requiredLevel: number ; 
    id: number ;
    title: string;
    description: string;
    difficulty: DifficultyClass;
    goldReward: number ;
    xpReward: number ;
    status : StatusClass;
}