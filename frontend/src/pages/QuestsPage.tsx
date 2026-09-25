import { useEffect, useState } from "react";
import { assignQuest, completeQuest, createQuest, getQuests } from "../services/questService";
import { getAdventurers } from "../services/adventurerService";
import type { DifficultyClass, Quest, QuestCreateRequest, StatusClass } from "../types/quest";
import type { Adventurer } from "../types/adventurer";
import type { ApiError } from "../types/apiError";
import { QuestCard } from "../components/QuestCard";
import { QuestFilters } from "../components/QuestFilters";
import { QuestForm } from "../components/QuestForm";
import { QuestActions } from "../components/QuestActions";

export function QuestsPage() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [adventurers, setAdventurers] = useState<Adventurer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusClass | "">("");
    const [difficulty, setDifficulty] = useState<DifficultyClass | "">("");
    const [showForm, setShowForm] = useState(false);
    const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        getQuests(status || undefined, difficulty || undefined)
            .then((data) => {
                if (cancelled) return;
                setQuests(data);
                setError(null);
            })
            .catch((err: ApiError) => {
                if (cancelled) return;
                setError(err.message ?? "Impossible de charger les quêtes.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [status, difficulty, reloadKey]);

    useEffect(() => {
        getAdventurers()
            .then(setAdventurers)
            .catch(() => setAdventurers([]));
    }, [reloadKey]);

    function reload() {
        setLoading(true);
        setReloadKey((current) => current + 1);
    }

    function handleStatusChange(newStatus: StatusClass | "") {
        setLoading(true);
        setStatus(newStatus);
    }

    function handleDifficultyChange(newDifficulty: DifficultyClass | "") {
        setLoading(true);
        setDifficulty(newDifficulty);
    }

    async function handleCreate(data: QuestCreateRequest) {
        await createQuest(data);
        setShowForm(false);
        reload();
    }

    async function handleAssign(questId: number, adventurerId: number) {
        await assignQuest(questId, { adventurerId });
        reload();
    }

    async function handleComplete(questId: number) {
        await completeQuest(questId);
        reload();
    }

    const selectedQuest = quests.find((quest) => quest.id === selectedQuestId) ?? null;

    return (
        <section>
            <QuestFilters
                status={status}
                difficulty={difficulty}
                onStatusChange={handleStatusChange}
                onDifficultyChange={handleDifficultyChange}
            />

            <button type="button" onClick={() => setShowForm((current) => !current)}>
                {showForm ? "Annuler" : "Nouvelle quête"}
            </button>
            {showForm && <QuestForm onSubmit={handleCreate} />}

            {loading && <p>Chargement...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && quests.length === 0 && <p>Aucune quête ne correspond à ces filtres.</p>}
            {!loading && !error && quests.length > 0 && (
                <ul>
                    {quests.map((quest) => (
                        <QuestCard key={quest.id} quest={quest} onSelect={setSelectedQuestId} />
                    ))}
                </ul>
            )}

            {selectedQuest && (
                <div>
                    <h2>{selectedQuest.title}</h2>
                    <p>{selectedQuest.description}</p>
                    <QuestActions
                        quest={selectedQuest}
                        adventurers={adventurers}
                        onAssign={handleAssign}
                        onComplete={handleComplete}
                    />
                </div>
            )}
        </section>
    );
}
