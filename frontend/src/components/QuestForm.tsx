import { useState } from "react";
import type { FormEvent } from "react";
import type { DifficultyClass, QuestCreateRequest } from "../types/quest";
import type { ApiError } from "../types/apiError";

interface QuestFormProps {
    initialValues?: QuestCreateRequest;
    onSubmit: (data: QuestCreateRequest) => Promise<void>;
}

const DIFFICULTIES: DifficultyClass[] = ["EASY", "MEDIUM", "HARD", "EPIC"];

export function QuestForm({ initialValues, onSubmit }: QuestFormProps) {
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");
    const [difficulty, setDifficulty] = useState<DifficultyClass>(initialValues?.difficulty ?? "EASY");
    const [requiredLevel, setRequiredLevel] = useState(initialValues?.requiredLevel ?? 1);
    const [goldReward, setGoldReward] = useState(initialValues?.goldReward ?? 0);
    const [xpReward, setXpReward] = useState(initialValues?.xpReward ?? 1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await onSubmit({ title, description, difficulty, requiredLevel, goldReward, xpReward });
        } catch (err) {
            setError((err as ApiError).message ?? "Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="quest-title">Titre</label>
                <input
                    id="quest-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    minLength={5}
                    maxLength={100}
                    required
                />
            </div>
            <div>
                <label htmlFor="quest-description">Description</label>
                <textarea
                    id="quest-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minLength={10}
                    maxLength={500}
                    required
                />
            </div>
            <div>
                <label htmlFor="quest-difficulty">Difficulté</label>
                <select
                    id="quest-difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyClass)}
                    required
                >
                    {DIFFICULTIES.map((difficultyOption) => (
                        <option key={difficultyOption} value={difficultyOption}>
                            {difficultyOption}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="quest-required-level">Niveau requis</label>
                <input
                    id="quest-required-level"
                    type="number"
                    min={1}
                    value={requiredLevel}
                    onChange={(e) => setRequiredLevel(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label htmlFor="quest-gold-reward">Récompense en or</label>
                <input
                    id="quest-gold-reward"
                    type="number"
                    min={0}
                    value={goldReward}
                    onChange={(e) => setGoldReward(Number(e.target.value))}
                    required
                />
            </div>
            <div>
                <label htmlFor="quest-xp-reward">Récompense en XP</label>
                <input
                    id="quest-xp-reward"
                    type="number"
                    min={1}
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    required
                />
            </div>
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>
                {submitting ? "Envoi..." : "Enregistrer"}
            </button>
        </form>
    );
}
