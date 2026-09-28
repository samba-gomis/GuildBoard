import { useEffect, useState } from "react";
import {
    deleteAdventurer,
    getAdventurer,
    getAdventurerHistory,
    updateAdventurer,
} from "../services/adventurerService";
import type { Adventurer, AdventurerCreateRequest } from "../types/adventurer";
import type { Assignment } from "../types/assignment";
import type { ApiError } from "../types/apiError";
import { CLASS_LABELS, classPortrait } from "../utils/display";
import { XpBar } from "../components/XpBar";
import { AdventurerForm } from "../components/AdventurerForm";
import { AssignmentHistory } from "../components/AssignmentHistory";
import { Modal } from "../components/Modal";
import { CoinIcon } from "../components/icons";

interface AdventurerDetailPageProps {
    adventurerId: number;
    onBack: () => void;
}

export function AdventurerDetailPage({ adventurerId, onBack }: AdventurerDetailPageProps) {
    const [adventurer, setAdventurer] = useState<Adventurer | null>(null);
    const [history, setHistory] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bannedMessage, setBannedMessage] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        Promise.all([getAdventurer(adventurerId), getAdventurerHistory(adventurerId)])
            .then(([adventurerData, historyData]) => {
                if (cancelled) return;
                setAdventurer(adventurerData);
                setHistory(historyData);
                setError(null);
            })
            .catch((err: ApiError) => {
                if (cancelled) return;
                if (err.status === 410) {
                    setBannedMessage(err.message);
                } else {
                    setError(err.message ?? "Impossible de charger cet aventurier.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [adventurerId, reloadKey]);

    async function handleUpdate(data: AdventurerCreateRequest) {
        await updateAdventurer(adventurerId, data);
        setEditing(false);
        setReloadKey((current) => current + 1);
    }

    async function handleDelete() {
        setDeleting(true);
        setDeleteError(null);
        try {
            await deleteAdventurer(adventurerId);
            onBack();
        } catch (err) {
            setDeleteError((err as ApiError).message ?? "Une erreur est survenue.");
            setDeleting(false);
            setConfirmingDelete(false);
        }
    }

    return (
        <section>
            <button type="button" onClick={onBack}>
                ← Retour aux membres
            </button>

            {loading && <p className="state-message">Chargement...</p>}
            {error && <p role="alert">{error}</p>}

            {bannedMessage && (
                <div className="banned-notice">
                    <p className="banned-notice-title">Aventurier banni</p>
                    <p>{bannedMessage}</p>
                    <p className="banned-notice-hint">
                        Son nom reste inscrit sur les quêtes qu'il a terminées, mais sa fiche n'est plus accessible.
                    </p>
                </div>
            )}

            {!loading && !error && !bannedMessage && adventurer && (
                <>
                    <div className={`adventurer-profile class-theme--${adventurer.characterClass.toLowerCase()}`}>
                        <img
                            className="adventurer-profile-portrait"
                            src={classPortrait(adventurer.characterClass)}
                            alt=""
                            width={180}
                            height={180}
                        />
                        <div className="adventurer-profile-info">
                            <div>
                                <h2>{adventurer.name}</h2>
                                <p className="adventurer-profile-class">{CLASS_LABELS[adventurer.characterClass]}</p>
                            </div>
                            <XpBar level={adventurer.level} xp={adventurer.xp} />
                            <p className="adventurer-profile-gold">
                                <CoinIcon />
                                {adventurer.gold} pièces d'or
                            </p>

                            {!confirmingDelete && (
                                <div className="adventurer-profile-actions">
                                    <button type="button" onClick={() => setEditing(true)}>
                                        Modifier
                                    </button>
                                    <button type="button" className="btn-danger" onClick={() => setConfirmingDelete(true)}>
                                        Supprimer
                                    </button>
                                </div>
                            )}
                            {confirmingDelete && (
                                <div className="delete-confirm">
                                    <p>
                                        Supprimer {adventurer.name} de la guilde ? Il sera banni : sa quête en cours
                                        redeviendra disponible, et son nom restera sur les quêtes qu'il a terminées.
                                    </p>
                                    <div className="adventurer-profile-actions">
                                        <button type="button" className="btn-danger" onClick={handleDelete} disabled={deleting}>
                                            {deleting ? "Suppression..." : "Oui, supprimer"}
                                        </button>
                                        <button type="button" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}
                            {deleteError && <p role="alert">{deleteError}</p>}
                        </div>
                    </div>

                    <div className="adventurer-history">
                        <h3>Historique des quêtes</h3>
                        <AssignmentHistory assignments={history} />
                    </div>

                    {editing && (
                        <Modal title="Modifier l'aventurier" onClose={() => setEditing(false)}>
                            <AdventurerForm
                                initialValues={{ name: adventurer.name, characterClass: adventurer.characterClass }}
                                submitLabel="Enregistrer les modifications"
                                onSubmit={handleUpdate}
                            />
                        </Modal>
                    )}
                </>
            )}
        </section>
    );
}
