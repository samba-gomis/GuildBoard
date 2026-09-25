import type { DifficultyClass, Quest } from "../types/quest";

interface QuestCardProps {
    quest: Quest;
    onSelect: (id: number) => void;
}

const DIFFICULTY_LABELS: Record<DifficultyClass, string> = {
    EASY: "Facile",
    MEDIUM: "Moyen",
    HARD: "Difficile",
    EPIC: "Épique",
};

export function QuestCard({ quest, onSelect }: QuestCardProps) {
    return (
        <li className={`quest-card quest-card--${quest.difficulty.toLowerCase()}`}>
            <button type="button" onClick={() => onSelect(quest.id)}>
                <strong>{quest.title}</strong>
                <span className="quest-card-difficulty">{DIFFICULTY_LABELS[quest.difficulty]}</span>
                <span className="quest-card-status">{quest.status}</span>
            </button>
        </li>
    );
}
