import type { DifficultyClass, StatusClass } from "../types/quest";
import { DIFFICULTIES, DIFFICULTY_LABELS } from "../utils/display";

interface QuestFiltersProps {
    status: StatusClass | "";
    difficulty: DifficultyClass | "";
    onStatusChange: (status: StatusClass | "") => void;
    onDifficultyChange: (difficulty: DifficultyClass | "") => void;
}

const STATUS_TABS: { value: StatusClass | ""; label: string }[] = [
    { value: "", label: "Toutes" },
    { value: "ON_GOING", label: "En cours" },
    { value: "AVAILABLE", label: "Disponibles" },
    { value: "COMPLETED", label: "Terminées" },
];

export function QuestFilters({ status, difficulty, onStatusChange, onDifficultyChange }: QuestFiltersProps) {
    return (
        <div className="quest-filters">
            <div className="status-tabs" role="group" aria-label="Filtrer par statut">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.label}
                        type="button"
                        className="status-tab"
                        aria-pressed={status === tab.value}
                        onClick={() => onStatusChange(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="difficulty-filter">
                <label htmlFor="filter-difficulty">Difficulté</label>
                <select
                    id="filter-difficulty"
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as DifficultyClass | "")}
                >
                    <option value="">Toutes</option>
                    {DIFFICULTIES.map((difficultyOption) => (
                        <option key={difficultyOption} value={difficultyOption}>
                            {DIFFICULTY_LABELS[difficultyOption]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
