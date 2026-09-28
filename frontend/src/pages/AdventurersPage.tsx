import { useEffect, useState } from "react";
import { createAdventurer, getAdventurers } from "../services/adventurerService";
import type { Adventurer, AdventurerCreateRequest } from "../types/adventurer";
import type { ApiError } from "../types/apiError";
import { AdventurerCard } from "../components/AdventurerCard";
import { AdventurerForm } from "../components/AdventurerForm";
import { Modal } from "../components/Modal";

const SEARCH_DELAY_MS = 300;

interface AdventurersPageProps {
    onSelectAdventurer: (id: number) => void;
}

export function AdventurersPage({ onSelectAdventurer }: AdventurersPageProps) {
    const [adventurers, setAdventurers] = useState<Adventurer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(
            () => {
                getAdventurers(search)
                    .then((data) => {
                        if (cancelled) return;
                        setAdventurers(data);
                        setError(null);
                    })
                    .catch((err: ApiError) => {
                        if (cancelled) return;
                        setError(err.message ?? "Impossible de charger les aventuriers.");
                    })
                    .finally(() => {
                        if (!cancelled) setLoading(false);
                    });
            },
            search ? SEARCH_DELAY_MS : 0,
        );
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [search, reloadKey]);

    async function handleCreate(data: AdventurerCreateRequest) {
        await createAdventurer(data);
        setShowForm(false);
        setReloadKey((current) => current + 1);
    }

    const searching = search.trim() !== "";

    return (
        <section>
            <div className="members-toolbar">
                <div className="members-search">
                    <label htmlFor="adventurer-search">Rechercher un aventurier</label>
                    <input
                        id="adventurer-search"
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nom de l'aventurier..."
                    />
                </div>
                <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>
                    + Nouvel aventurier
                </button>
            </div>
            {searching && <p className="members-hint">La recherche inclut les aventuriers bannis de la guilde.</p>}

            {loading && adventurers.length === 0 && <p className="state-message">Chargement des aventuriers...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && adventurers.length === 0 && (
                <p className="state-message">
                    {searching ? `Aucun aventurier ne correspond à « ${search.trim()} ».` : "Aucun aventurier pour le moment."}
                </p>
            )}
            {adventurers.length > 0 && (
                <ul className="adventurer-grid">
                    {adventurers.map((adventurer) => (
                        <AdventurerCard key={adventurer.id} adventurer={adventurer} onSelect={onSelectAdventurer} />
                    ))}
                </ul>
            )}

            {showForm && (
                <Modal title="Nouvel aventurier" onClose={() => setShowForm(false)}>
                    <AdventurerForm submitLabel="Recruter l'aventurier" onSubmit={handleCreate} />
                </Modal>
            )}
        </section>
    );
}
