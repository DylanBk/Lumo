'use client';

import { createContext, useCallback, useContext, useState } from "react";


type Toast = {
    title: string;
    context: 'info' | 'success' | 'warning' | 'error';
    content: string;
    visible: boolean;
};

interface ToastContextType {
    toast: Toast;
    showToast: (title: string, content: string, context?: Toast['context']) => void;
    hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({children}: {children: React.ReactNode}) => {
    const [toast, setToast] = useState<Toast>({
        title: '',
        context: 'info',
        content: '',
        visible: false,
    });

    const showToast = useCallback((title: string, content: string, context: Toast['context'] = 'info') => {
        setToast({ title, content, context, visible: true });

        const timer = setTimeout(() => {
            hideToast();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const hideToast = () => {
        setToast(t => ({ ...t, visible: false }));
    };

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const ctx = useContext(ToastContext);

    if (!ctx) throw new Error('useToast must be used within a ToastProvider');

    return ctx;
};