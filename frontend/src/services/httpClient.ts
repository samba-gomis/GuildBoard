import type { ApiError } from "../types/apiError";

const BASE_URL = "http://localhost:8080/api";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error: ApiError = await response.json();
        throw error;
    }
    if (response.status === 204) {
        return undefined as T;
    }
    return response.json();
}

export async function apiGet<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`);
    return handleResponse<T>(response);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
}

export async function apiDelete(path: string): Promise<void> {
    const response = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
    await handleResponse<void>(response);
}
