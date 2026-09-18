import { useState } from "react";
import type { FormEvent } from "react";
import type { AdventurerCreateRequest, CharacterClass } from "../types/adventurer";
import type { ApiError } from "../types/apiError";

interface AdventurerFormProps {
    initialValues?: AdventurerCreateRequest;
    onSubmit: (data: AdventurerCreateRequest) => Promise<void>;
}

const CHARACTER_CLASSES: CharacterClass[] = ["WARRIOR", "MAGE", "RANGER", "CLERIC"];

export function AdventurerForm({ initialValues, onSubmit }: AdventurerFormProps) {
    const [name, setName] = useState(initialValues?.name ?? "");
    const [characterClass, setCharacterClass] = useState<CharacterClass>(initialValues?.characterClass ?? "WARRIOR");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await onSubmit({ name, characterClass });
        } catch (err) {
            setError((err as ApiError).message ?? "Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="adventurer-name">Nom</label>
                <input
                    id="adventurer-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength={2}
                    maxLength={50}
                    required
                />
            </div>
            <div>
                <label htmlFor="adventurer-class">Classe</label>
                <select
                    id="adventurer-class"
                    value={characterClass}
                    onChange={(e) => setCharacterClass(e.target.value as CharacterClass)}
                    required
                >
                    {CHARACTER_CLASSES.map((characterClassOption) => (
                        <option key={characterClassOption} value={characterClassOption}>
                            {characterClassOption}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={submitting}>
                {submitting ? "Envoi..." : "Enregistrer"}
            </button>
        </form>
    );
}
