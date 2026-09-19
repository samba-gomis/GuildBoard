import type { DifficultyClass, StatusClass } from "../types/quest";

interface QuestFiltersProps {
    status: StatusClass | "";
    difficulty: DifficultyClass | "";
    onStatusChange: (status: StatusClass | "") => void;
    onDifficultyChange: (difficulty: DifficultyClass | "") => void;
}

const STATUSES: StatusClass[] = ["AVAILABLE", "ON_GOING", "COMPLETED"];
const DIFFICULTIES: DifficultyClass[] = ["EASY", "MEDIUM", "HARD", "EPIC"];

export function QuestFilters({ status, difficulty, onStatusChange, onDifficultyChange }: QuestFiltersProps) {
    return (
        <div className="quest-filters">
            <div>
                <label htmlFor="filter-status">Statut</label>
                <select
                    id="filter-status"
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value as StatusClass | "")}
                >
                    <option value="">Tous</option>
                    {STATUSES.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                            {statusOption}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="filter-difficulty">Difficulté</label>
                <select
                    id="filter-difficulty"
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as DifficultyClass | "")}
                >
                    <option value="">Toutes</option>
                    {DIFFICULTIES.map((difficultyOption) => (
                        <option key={difficultyOption} value={difficultyOption}>
                            {difficultyOption}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
