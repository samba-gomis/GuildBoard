import type { Adventurer } from "../types/adventurer";
import { CLASS_LABELS, classPortrait } from "../utils/display";
import { CoinIcon } from "./icons";
import { XpBar } from "./XpBar";

interface AdventurerCardProps {
    adventurer: Adventurer;
    onSelect: (id: number) => void;
}

export function AdventurerCard({ adventurer, onSelect }: AdventurerCardProps) {
    const classModifier = `class-theme--${adventurer.characterClass.toLowerCase()}`;

    return (
        <li className={`adventurer-card ${classModifier}${adventurer.banned ? " adventurer-card--banned" : ""}`}>
            <button type="button" className="adventurer-card-button" onClick={() => onSelect(adventurer.id)}>
                <img
                    className="adventurer-portrait"
                    src={classPortrait(adventurer.characterClass)}
                    alt=""
                    width={64}
                    height={64}
                />
                <span className="adventurer-card-body">
                    <span className="adventurer-card-name">
                        {adventurer.name}
                        {adventurer.banned && <span className="badge badge--banned">Banni</span>}
                    </span>
                    <span className="adventurer-card-class">{CLASS_LABELS[adventurer.characterClass]}</span>
                    <XpBar level={adventurer.level} xp={adventurer.xp} />
                </span>
                <span className="adventurer-card-gold">
                    <CoinIcon />
                    {adventurer.gold}
                    <span className="visually-hidden"> pièces d'or</span>
                </span>
            </button>
        </li>
    );
}
