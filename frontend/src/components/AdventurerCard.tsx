import type { Adventurer } from "../types/adventurer";

interface AdventurerCardProps {
    adventurer: Adventurer;
    onSelect: (id: number) => void;
}

export function AdventurerCard({ adventurer, onSelect }: AdventurerCardProps) {
    return (
        <li className="adventurer-card">
            <button type="button" onClick={() => onSelect(adventurer.id)}>
                <strong>{adventurer.name}</strong> — {adventurer.characterClass} — niveau {adventurer.level}
            </button>
        </li>
    );
}
