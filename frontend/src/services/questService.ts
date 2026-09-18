import { apiDelete, apiGet, apiPost, apiPut } from "./httpClient";
import type { DifficultyClass, Quest, QuestCreateRequest, StatusClass } from "../types/quest";
import type { Assignment, AssignmentCreateRequest } from "../types/assignment";

export function getQuests(status?: StatusClass, difficulty?: DifficultyClass): Promise<Quest[]> {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (difficulty) params.set("difficulty", difficulty);
    const query = params.toString();
    return apiGet<Quest[]>(`/quests${query ? `?${query}` : ""}`);
}

export function getQuest(id: number): Promise<Quest> {
    return apiGet<Quest>(`/quests/${id}`);
}

export function createQuest(data: QuestCreateRequest): Promise<Quest> {
    return apiPost<Quest>("/quests", data);
}

export function updateQuest(id: number, data: QuestCreateRequest): Promise<Quest> {
    return apiPut<Quest>(`/quests/${id}`, data);
}

export function deleteQuest(id: number): Promise<void> {
    return apiDelete(`/quests/${id}`);
}

export function assignQuest(id: number, data: AssignmentCreateRequest): Promise<Assignment> {
    return apiPost<Assignment>(`/quests/${id}/assignment`, data);
}

export function completeQuest(id: number): Promise<Assignment> {
    return apiPost<Assignment>(`/quests/${id}/completion`);
}
