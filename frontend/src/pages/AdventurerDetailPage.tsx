import { useEffect, useState } from "react";
import { getAdventurer, getAdventurerHistory, updateAdventurer } from "../services/adventurerService";
import type { Adventurer, AdventurerCreateRequest } from "../types/adventurer";
import type { Assignment } from "../types/assignment";
import type { ApiError } from "../types/apiError";
import { XpBar } from "../components/XpBar";
import { AdventurerForm } from "../components/AdventurerForm";
import { AssignmentHistory } from "../components/AssignmentHistory";

interface AdventurerDetailPageProps {
    adventurerId: number;
    onBack: () => void;
}

export function AdventurerDetailPage({ adventurerId, onBack }: AdventurerDetailPageProps) {
    const [adventurer, setAdventurer] = useState<Adventurer | null>(null);
    const [history, setHistory] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
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
                setError(err.message ?? "Impossible de charger cet aventurier.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [adventurerId, reloadKey]);

    function reload() {
        setLoading(true);
        setReloadKey((current) => current + 1);
    }

    async function handleUpdate(data: AdventurerCreateRequest) {
        await updateAdventurer(adventurerId, data);
        setEditing(false);
        reload();
    }

    return (
        <section>
            <button type="button" onClick={onBack}>
                ← Retour
            </button>

            {loading && <p>Chargement...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && adventurer && (
                <>
                    <h2>{adventurer.name}</h2>
                    <p>{adventurer.characterClass}</p>
                    <XpBar level={adventurer.level} xp={adventurer.xp} />
                    <p>Or : {adventurer.gold}</p>

                    <button type="button" onClick={() => setEditing((current) => !current)}>
                        {editing ? "Annuler" : "Modifier"}
                    </button>
                    {editing && (
                        <AdventurerForm
                            initialValues={{ name: adventurer.name, characterClass: adventurer.characterClass }}
                            onSubmit={handleUpdate}
                        />
                    )}

                    <h3>Historique</h3>
                    <AssignmentHistory assignments={history} />
                </>
            )}
        </section>
    );
}
