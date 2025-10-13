'use client';

import { createContext, useContext } from 'react';
import type { SessionPayload } from '@/lib/definitions';

const SessionContext = createContext<SessionPayload | null>(null);

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({
    value,
    children,
}: {
    value: SessionPayload | null;
    children: React.ReactNode;
}) => (
        <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
);