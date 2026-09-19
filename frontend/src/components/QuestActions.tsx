import { useState } from "react";
import type { Quest } from "../types/quest";
import type { Adventurer } from "../types/adventurer";
import type { ApiError } from "../types/apiError";

interface QuestActionsProps {
    quest: Quest;
    adventurers: Adventurer[];
    onAssign: (questId: number, adventurerId: number) => Promise<void>;
    onComplete: (questId: number) => Promise<void>;
}

export function QuestActions({ quest, adventurers, onAssign, onComplete }: QuestActionsProps) {
    const [selectedAdventurerId, setSelectedAdventurerId] = useState<number | "">("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAssign() {
        if (selectedAdventurerId === "") return;
        setSubmitting(true);
        setError(null);
        try {
            await onAssign(quest.id, selectedAdventurerId);
        } catch (err) {
            setError((err as ApiError).message ?? "Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleComplete() {
        setSubmitting(true);
        setError(null);
        try {
            await onComplete(quest.id);
        } catch (err) {
            setError((err as ApiError).message ?? "Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="quest-actions">
            {quest.status === "AVAILABLE" && (
                <div>
                    <label htmlFor="quest-assign-adventurer">Assigner à</label>
                    <select
                        id="quest-assign-adventurer"
                        value={selectedAdventurerId}
                        onChange={(e) => setSelectedAdventurerId(e.target.value ? Number(e.target.value) : "")}
                    >
                        <option value="">Choisir un aventurier</option>
                        {adventurers.map((adventurer) => (
                            <option key={adventurer.id} value={adventurer.id}>
                                {adventurer.name} (niveau {adventurer.level})
                            </option>
                        ))}
                    </select>
                    <button type="button" onClick={handleAssign} disabled={submitting || selectedAdventurerId === ""}>
                        Assigner
                    </button>
                </div>
            )}
            {quest.status === "ON_GOING" && (
                <button type="button" onClick={handleComplete} disabled={submitting}>
                    Marquer comme terminée
                </button>
            )}
            {error && <p role="alert">{error}</p>}
        </div>
    );
}
