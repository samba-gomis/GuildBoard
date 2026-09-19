interface XpBarProps {
    level: number;
    xp: number;
}

export function XpBar({ level, xp }: XpBarProps) {
    const threshold = level * 100;
    const percent = Math.min(100, Math.round((xp / threshold) * 100));

    return (
        <div className="xp-bar">
            <div className="xp-bar-label">
                Niveau {level} — {xp} / {threshold} XP
            </div>
            <div
                className="xp-bar-track"
                role="progressbar"
                aria-valuenow={xp}
                aria-valuemin={0}
                aria-valuemax={threshold}
            >
                <div className="xp-bar-fill" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
