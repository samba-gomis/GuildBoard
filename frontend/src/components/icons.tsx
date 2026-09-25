import type { ReactNode } from "react";

function BaseIcon({ children }: { children: ReactNode }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

export function QuestIcon() {
    return (
        <BaseIcon>
            <path d="M5 21V4" />
            <path d="M5 4h12l-2.5 4.5L17 13H5" />
        </BaseIcon>
    );
}

export function MembersIcon() {
    return (
        <BaseIcon>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M16 14.1c3.1-.3 5.5 2.1 5.5 5.4" />
        </BaseIcon>
    );
}
