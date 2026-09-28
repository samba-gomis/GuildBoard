import { useEffect, useState } from "react";
import {
    assignQuest,
    completeQuest,
    createQuest,
    deleteQuest,
    getQuests,
    updateQuest,
} from "../services/questService";
import { getAdventurers } from "../services/adventurerService";
import type { DifficultyClass, Quest, QuestCreateRequest, StatusClass } from "../types/quest";
import type { Adventurer } from "../types/adventurer";
import type { ApiError } from "../types/apiError";
import { QuestCard } from "../components/QuestCard";
import { QuestFilters } from "../components/QuestFilters";
import { QuestForm } from "../components/QuestForm";
import { QuestDetail } from "../components/QuestDetail";
import { Modal } from "../components/Modal";

type ModalState = { mode: "create" } | { mode: "edit"; quest: Quest } | null;

export function QuestsPage() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [adventurers, setAdventurers] = useState<Adventurer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adventurersError, setAdventurersError] = useState<string | null>(null);
    const [status, setStatus] = useState<StatusClass | "">("");
    const [difficulty, setDifficulty] = useState<DifficultyClass | "">("");
    const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
    const [modal, setModal] = useState<ModalState>(null);
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
        let cancelled = false;
        getAdventurers()
            .then((data) => {
                if (cancelled) return;
                setAdventurers(data);
                setAdventurersError(null);
            })
            .catch((err: ApiError) => {
                if (cancelled) return;
                setAdventurersError(err.message ?? "Impossible de charger les aventuriers.");
            });
        return () => {
            cancelled = true;
        };
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
        const created = await createQuest(data);
        setModal(null);
        setSelectedQuestId(created.id);
        reload();
    }

    async function handleUpdate(questId: number, data: QuestCreateRequest) {
        await updateQuest(questId, data);
        setModal(null);
        reload();
    }

    async function handleDelete(questId: number) {
        await deleteQuest(questId);
        setSelectedQuestId(null);
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

    const selectedQuest = quests.find((quest) => quest.id === selectedQuestId) ?? quests[0] ?? null;

    return (
        <section className="quests-page">
            <div className="quests-toolbar">
                <QuestFilters
                    status={status}
                    difficulty={difficulty}
                    onStatusChange={handleStatusChange}
                    onDifficultyChange={handleDifficultyChange}
                />
                <button type="button" className="btn-primary" onClick={() => setModal({ mode: "create" })}>
                    + Nouvelle quête
                </button>
            </div>

            {adventurersError && <p role="alert">{adventurersError}</p>}

            <div className={`quests-layout${selectedQuest ? " quests-layout--with-detail" : ""}`}>
                <div>
                    {loading && quests.length === 0 && <p className="state-message">Chargement des quêtes...</p>}
                    {error && <p role="alert">{error}</p>}
                    {!loading && !error && quests.length === 0 && (
                        <p className="state-message">Aucune quête ne correspond à ces filtres.</p>
                    )}
                    {quests.length > 0 && (
                        <ul className="quest-list" aria-busy={loading}>
                            {quests.map((quest) => (
                                <QuestCard
                                    key={quest.id}
                                    quest={quest}
                                    selected={quest.id === selectedQuest?.id}
                                    onSelect={setSelectedQuestId}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                {selectedQuest && (
                    <QuestDetail
                        key={selectedQuest.id}
                        quest={selectedQuest}
                        adventurers={adventurers}
                        onAssign={handleAssign}
                        onComplete={handleComplete}
                        onEdit={(quest) => setModal({ mode: "edit", quest })}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {modal?.mode === "create" && (
                <Modal title="Nouvelle quête" onClose={() => setModal(null)}>
                    <QuestForm submitLabel="Créer la quête" onSubmit={handleCreate} />
                </Modal>
            )}
            {modal?.mode === "edit" && (
                <Modal title="Modifier la quête" onClose={() => setModal(null)}>
                    <QuestForm
                        initialValues={{
                            title: modal.quest.title,
                            description: modal.quest.description,
                            difficulty: modal.quest.difficulty,
                            requiredLevel: modal.quest.requiredLevel,
                            goldReward: modal.quest.goldReward,
                            xpReward: modal.quest.xpReward,
                        }}
                        submitLabel="Enregistrer les modifications"
                        onSubmit={(data) => handleUpdate(modal.quest.id, data)}
                    />
                </Modal>
            )}
        </section>
    );
}
