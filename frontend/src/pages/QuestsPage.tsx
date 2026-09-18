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

    function loadQuests() {
        setLoading(true);
        setError(null);
        getQuests(status || undefined, difficulty || undefined)
            .then(setQuests)
            .catch((err: ApiError) => setError(err.message ?? "Impossible de charger les quêtes."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadQuests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, difficulty]);

    useEffect(() => {
        getAdventurers()
            .then(setAdventurers)
            .catch(() => setAdventurers([]));
    }, []);

    async function handleCreate(data: QuestCreateRequest) {
        await createQuest(data);
        setShowForm(false);
        loadQuests();
    }

    async function handleAssign(questId: number, adventurerId: number) {
        await assignQuest(questId, { adventurerId });
        loadQuests();
    }

    async function handleComplete(questId: number) {
        await completeQuest(questId);
        loadQuests();
    }

    const selectedQuest = quests.find((quest) => quest.id === selectedQuestId) ?? null;

    return (
        <section>
            <h1>Quêtes</h1>
            <QuestFilters
                status={status}
                difficulty={difficulty}
                onStatusChange={setStatus}
                onDifficultyChange={setDifficulty}
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
