import type { Assignment } from "../types/assignment";

interface AssignmentHistoryProps {
    assignments: Assignment[];
}

export function AssignmentHistory({ assignments }: AssignmentHistoryProps) {
    if (assignments.length === 0) {
        return <p>Aucune quête dans l'historique.</p>;
    }

    return (
        <ul className="assignment-history">
            {assignments.map((assignment) => (
                <li key={assignment.id}>
                    <strong>{assignment.questTitle}</strong>
                    {" — "}
                    {assignment.completedAt
                        ? `Terminée le ${new Date(assignment.completedAt).toLocaleDateString("fr-FR")}`
                        : "En cours"}
                </li>
            ))}
        </ul>
    );
}
