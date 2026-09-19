import { apiDelete, apiGet, apiPost, apiPut } from "./httpClient";
import type { Adventurer, AdventurerCreateRequest } from "../types/adventurer";
import type { Assignment } from "../types/assignment";

export function getAdventurers(): Promise<Adventurer[]> {
    return apiGet<Adventurer[]>("/adventurers");
}

export function getAdventurer(id: number): Promise<Adventurer> {
    return apiGet<Adventurer>(`/adventurers/${id}`);
}

export function createAdventurer(data: AdventurerCreateRequest): Promise<Adventurer> {
    return apiPost<Adventurer>("/adventurers", data);
}

export function updateAdventurer(id: number, data: AdventurerCreateRequest): Promise<Adventurer> {
    return apiPut<Adventurer>(`/adventurers/${id}`, data);
}

export function deleteAdventurer(id: number): Promise<void> {
    return apiDelete(`/adventurers/${id}`);
}

export function getAdventurerHistory(id: number): Promise<Assignment[]> {
    return apiGet<Assignment[]>(`/adventurers/${id}/history`);
}
