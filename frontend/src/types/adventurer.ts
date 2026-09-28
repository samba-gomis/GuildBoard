export type CharacterClass = "WARRIOR" | "MAGE" | "RANGER" | "CLERIC";

export interface Adventurer {
    id: number;
    name: string;
    characterClass: CharacterClass;
    level: number;
    xp: number;
    gold: number;
    banned: boolean;
}

export interface AdventurerCreateRequest {
    name: string;
    characterClass: CharacterClass;
}
