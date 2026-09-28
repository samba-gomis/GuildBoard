import type { Assignment } from "../types/assignment";
import { formatDate } from "../utils/display";

interface AssignmentHistoryProps {
    assignments: Assignment[];
}

export function AssignmentHistory({ assignments }: AssignmentHistoryProps) {
    if (assignments.length === 0) {
        return <p className="state-message">Aucune quête dans l'historique.</p>;
    }

    return (
        <ul className="assignment-history">
            {assignments.map((assignment) => (
                <li key={assignment.id}>
                    <strong>{assignment.questTitle}</strong>
                    <span className={`badge badge--status ${assignment.completedAt ? "badge--completed" : "badge--on_going"}`}>
                        {assignment.completedAt ? `Terminée le ${formatDate(assignment.completedAt)}` : "En cours"}
                    </span>
                </li>
            ))}
        </ul>
    );
}
