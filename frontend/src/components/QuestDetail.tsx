import { useState } from "react";
import type { Quest } from "../types/quest";
import type { Adventurer } from "../types/adventurer";
import type { ApiError } from "../types/apiError";
import { DIFFICULTY_LABELS, STATUS_LABELS, difficultyBanner } from "../utils/display";
import { QuestActions } from "./QuestActions";
import { Rewards } from "./Rewards";

interface QuestDetailProps {
    quest: Quest;
    adventurers: Adventurer[];
    onAssign: (questId: number, adventurerId: number) => Promise<void>;
    onComplete: (questId: number) => Promise<void>;
    onEdit: (quest: Quest) => void;
    onDelete: (questId: number) => Promise<void>;
}

export function QuestDetail({ quest, adventurers, onAssign, onComplete, onEdit, onDelete }: QuestDetailProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleDelete() {
        setDeleting(true);
        setError(null);
        try {
            await onDelete(quest.id);
        } catch (err) {
            setError((err as ApiError).message ?? "Une erreur est survenue.");
            setDeleting(false);
            setConfirmingDelete(false);
        }
    }

    return (
        <aside className="quest-detail" aria-label="Détail de la quête">
            <img
                className="quest-detail-banner"
                src={difficultyBanner(quest.difficulty)}
                alt={`Difficulté : ${DIFFICULTY_LABELS[quest.difficulty]}`}
            />
            <div className="quest-detail-body">
                <div>
                    <h2>{quest.title}</h2>
                    <p className="quest-detail-description">{quest.description}</p>
                </div>

                <dl className="quest-detail-facts">
                    <div>
                        <dt>Statut</dt>
                        <dd>
                            <span className={`badge badge--status badge--${quest.status.toLowerCase()}`}>
                                {STATUS_LABELS[quest.status]}
                            </span>
                        </dd>
                    </div>
                    <div>
                        <dt>Niveau requis</dt>
                        <dd>{quest.requiredLevel}</dd>
                    </div>
                </dl>

                <div className="quest-detail-section">
                    <h3>Récompenses</h3>
                    <Rewards gold={quest.goldReward} xp={quest.xpReward} size="large" />
                </div>

                <QuestActions quest={quest} adventurers={adventurers} onAssign={onAssign} onComplete={onComplete} />

                {quest.status === "AVAILABLE" && (
                    <div className="quest-detail-manage">
                        {!confirmingDelete && (
                            <>
                                <button type="button" onClick={() => onEdit(quest)}>
                                    Modifier
                                </button>
                                <button type="button" className="btn-danger" onClick={() => setConfirmingDelete(true)}>
                                    Supprimer
                                </button>
                            </>
                        )}
                        {confirmingDelete && (
                            <>
                                <p className="quest-detail-confirm">Supprimer définitivement cette quête ?</p>
                                <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
                                    {deleting ? "Suppression..." : "Oui, supprimer"}
                                </button>
                                <button type="button" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                                    Annuler
                                </button>
                            </>
                        )}
                    </div>
                )}

                {error && <p role="alert">{error}</p>}
            </div>
        </aside>
    );
}
