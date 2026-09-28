import type { ReactNode } from "react";
import { MembersIcon, QuestIcon } from "./icons";

export type View = "quests" | "members";

interface NavItem {
    view: View;
    label: string;
    icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { view: "quests", label: "Quêtes", icon: <QuestIcon /> },
    { view: "members", label: "Membres", icon: <MembersIcon /> },
];

interface SidebarProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <img className="sidebar-logo" src="/images/logo.jpg" alt="" width={44} height={44} />
                <span className="sidebar-title">GuildBoard</span>
            </div>
            <nav className="sidebar-nav" aria-label="Navigation principale">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.view}
                        type="button"
                        className="nav-item"
                        aria-current={currentView === item.view ? "page" : undefined}
                        onClick={() => onNavigate(item.view)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}
