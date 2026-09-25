import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import type { View } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { MembersIcon, QuestIcon } from "./components/icons";
import { QuestsPage } from "./pages/QuestsPage";
import { AdventurersPage } from "./pages/AdventurersPage";
import { AdventurerDetailPage } from "./pages/AdventurerDetailPage";

const HEADINGS: Record<View, { title: string; subtitle: string; icon: ReactNode }> = {
    quests: {
        title: "Quêtes de la guilde",
        subtitle: "Relevez des défis, gagnez des récompenses et faites grandir votre guilde.",
        icon: <QuestIcon />,
    },
    members: {
        title: "Membres de la guilde",
        subtitle: "Vos aventuriers, leur niveau et leur historique de quêtes.",
        icon: <MembersIcon />,
    },
};

function App() {
    const [view, setView] = useState<View>("quests");
    const [selectedAdventurerId, setSelectedAdventurerId] = useState<number | null>(null);

    function navigate(nextView: View) {
        setSelectedAdventurerId(null);
        setView(nextView);
    }

    const heading = HEADINGS[view];

    return (
        <div className="app-shell">
            <Sidebar currentView={view} onNavigate={navigate} />
            <div className="app-main">
                <Topbar title={heading.title} subtitle={heading.subtitle} icon={heading.icon} />
                <main className="content">
                    {view === "quests" && <QuestsPage />}
                    {view === "members" && selectedAdventurerId === null && (
                        <AdventurersPage onSelectAdventurer={setSelectedAdventurerId} />
                    )}
                    {view === "members" && selectedAdventurerId !== null && (
                        <AdventurerDetailPage
                            adventurerId={selectedAdventurerId}
                            onBack={() => setSelectedAdventurerId(null)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
