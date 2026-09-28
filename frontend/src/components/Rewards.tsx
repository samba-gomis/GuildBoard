import { CoinIcon } from "./icons";

interface RewardsProps {
    gold: number;
    xp: number;
    size?: "small" | "large";
}

export function Rewards({ gold, xp, size = "small" }: RewardsProps) {
    return (
        <span className={`rewards rewards--${size}`}>
            <span className="reward">
                <CoinIcon />
                {gold}
                <span className="visually-hidden"> pièces d'or</span>
            </span>
            <span className="reward">
                <span className="xp-chip" aria-hidden="true">
                    XP
                </span>
                {xp}
                <span className="visually-hidden"> points d'expérience</span>
            </span>
        </span>
    );
}
