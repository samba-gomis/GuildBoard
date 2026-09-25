import type { ReactNode } from "react";

interface TopbarProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
}

export function Topbar({ title, subtitle, icon }: TopbarProps) {
    return (
        <header className="topbar">
            <div className="topbar-heading">
                <span className="topbar-icon">{icon}</span>
                <div>
                    <h1>{title}</h1>
                    <p className="topbar-subtitle">{subtitle}</p>
                </div>
            </div>
            <div className="topbar-user">
                <span className="topbar-user-avatar" aria-hidden="true">
                    MG
                </span>
                <div>
                    <p className="topbar-user-name">Maître de guilde</p>
                    <p className="topbar-user-role">GuildBoard</p>
                </div>
            </div>
        </header>
    );
}
