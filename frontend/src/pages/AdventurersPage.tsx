import { useEffect, useState } from "react";
import { createAdventurer, getAdventurers } from "../services/adventurerService";
import type { Adventurer, AdventurerCreateRequest } from "../types/adventurer";
import type { ApiError } from "../types/apiError";
import { AdventurerCard } from "../components/AdventurerCard";
import { AdventurerForm } from "../components/AdventurerForm";

interface AdventurersPageProps {
    onSelectAdventurer: (id: number) => void;
}

export function AdventurersPage({ onSelectAdventurer }: AdventurersPageProps) {
    const [adventurers, setAdventurers] = useState<Adventurer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    function loadAdventurers() {
        setLoading(true);
        setError(null);
        getAdventurers()
            .then(setAdventurers)
            .catch((err: ApiError) => setError(err.message ?? "Impossible de charger les aventuriers."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadAdventurers();
    }, []);

    async function handleCreate(data: AdventurerCreateRequest) {
        await createAdventurer(data);
        setShowForm(false);
        loadAdventurers();
    }

    return (
        <section>
            <h1>Aventuriers</h1>
            <button type="button" onClick={() => setShowForm((current) => !current)}>
                {showForm ? "Annuler" : "Nouvel aventurier"}
            </button>
            {showForm && <AdventurerForm onSubmit={handleCreate} />}

            {loading && <p>Chargement...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && adventurers.length === 0 && <p>Aucun aventurier pour le moment.</p>}
            {!loading && !error && adventurers.length > 0 && (
                <ul>
                    {adventurers.map((adventurer) => (
                        <AdventurerCard key={adventurer.id} adventurer={adventurer} onSelect={onSelectAdventurer} />
                    ))}
                </ul>
            )}
        </section>
    );
}
