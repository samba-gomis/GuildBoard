import type { Quest } from "../types/quest";
import { DIFFICULTY_LABELS, STATUS_LABELS } from "../utils/display";
import { Rewards } from "./Rewards";

interface QuestCardProps {
    quest: Quest;
    selected: boolean;
    onSelect: (id: number) => void;
}

export function QuestCard({ quest, selected, onSelect }: QuestCardProps) {
    return (
        <li className={`quest-card quest-card--${quest.difficulty.toLowerCase()}`}>
            <button
                type="button"
                className="quest-card-button"
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(quest.id)}
            >
                <span className="quest-card-emblem" aria-hidden="true" />
                <span className="quest-card-body">
                    <span className="quest-card-title">{quest.title}</span>
                    <span className="quest-card-description">{quest.description}</span>
                    <span className="quest-card-meta">
                        <span className="badge badge--difficulty">{DIFFICULTY_LABELS[quest.difficulty]}</span>
                        <span className={`badge badge--status badge--${quest.status.toLowerCase()}`}>
                            {STATUS_LABELS[quest.status]}
                        </span>
                        <span className="quest-card-level">Niveau {quest.requiredLevel} requis</span>
                    </span>
                </span>
                <Rewards gold={quest.goldReward} xp={quest.xpReward} />
            </button>
        </li>
    );
}
