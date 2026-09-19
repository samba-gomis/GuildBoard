import { useState } from "react";
import { QuestsPage } from "./pages/QuestsPage";
import { AdventurersPage } from "./pages/AdventurersPage";
import { AdventurerDetailPage } from "./pages/AdventurerDetailPage";

type View = "quests" | "adventurers";

function App() {
    const [view, setView] = useState<View>("quests");
    const [selectedAdventurerId, setSelectedAdventurerId] = useState<number | null>(null);

    function goToAdventurers() {
        setSelectedAdventurerId(null);
        setView("adventurers");
    }

    return (
        <div className="app">
            <nav className="app-nav">
                <button type="button" onClick={() => setView("quests")}>
                    Quêtes
                </button>
                <button type="button" onClick={goToAdventurers}>
                    Aventuriers
                </button>
            </nav>

            <main>
                {view === "quests" && <QuestsPage />}
                {view === "adventurers" && selectedAdventurerId === null && (
                    <AdventurersPage onSelectAdventurer={setSelectedAdventurerId} />
                )}
                {view === "adventurers" && selectedAdventurerId !== null && (
                    <AdventurerDetailPage
                        adventurerId={selectedAdventurerId}
                        onBack={() => setSelectedAdventurerId(null)}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
