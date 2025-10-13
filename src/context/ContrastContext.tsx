'use client';

import { createContext, useContext, useState, useEffect } from "react";


interface ContrastContextType {
    contrast: boolean;
    setContrast: (contrast: boolean) => void;
    toggleContrast: () => void;
};

const ContrastContext = createContext<ContrastContextType | undefined>(undefined);

export const ContrastProvider = ({children}: {children: React.ReactNode}) => {
    const [contrast, setContrastState] = useState<boolean>(false);

    useEffect(() => {
        const savedContrast = localStorage.getItem('contrast') as boolean | null;

        if (savedContrast) {
            setContrastState(savedContrast);
            document.documentElement.setAttribute('data-contrast', String(savedContrast));
        };
    }, []);

    const setContrast = (state: boolean) => {
        setContrastState(state);
        document.documentElement.setAttribute('data-contrast', String(state));
        localStorage.setItem('contrast', String(state));
    };

    const toggleContrast = () => setContrast(!contrast);

    return (
        <ContrastContext.Provider value={{contrast, setContrast, toggleContrast}}>
            {children}
        </ContrastContext.Provider>
    );
};

export const useContrast = () => {
    const ctx = useContext(ContrastContext);

    if (!ctx) throw new Error('useContrast must be used within a ContrastProvider');

    return ctx;
};