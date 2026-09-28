export interface Assignment {
    id: number;
    adventurerId: number;
    adventurerName: string;
    adventurerBanned: boolean;
    questId: number;
    questTitle: string;
    assignedAt: string;
    completedAt: string | null;
}

export interface AssignmentCreateRequest {
    adventurerId: number;
}
