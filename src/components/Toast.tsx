'use client';

import { useToast } from "@/context/ToastContext";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";


const Toast = () => {
    const {toast, hideToast} = useToast();
    const [bar, setBar] = useState<string>('bg-blue-500');
    const [text, setText] = useState<string>('text-blue-500');

    useEffect(() => {
        switch(toast.context) {
            case "info":
                setBar('bg-accent');
                setText('text-accent');
                break;
            case "success":
                setBar('bg-success');
                setText('text-success');
                break;
            case "warning":
                setBar('bg-warning');
                setText('text-warning');
                break;
            case "error":
                setBar('bg-error');
                setText('text-error');
                break;
            default:
                setBar('bg-error');
                setText('text-error');
                console.error('Invalid toast context:', toast.context);
        };
    }, [toast.context]);

    return (
        <AnimatePresence>
            {toast.visible &&
                <motion.div
                    className={`absolute right-8 bottom-4 flex flex-col p-4 rounded-md bg-surface border border-border z-[999]`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    layout>
                    <div className={`h-2 w-full absolute left-0 top-0 rounded-t-md ${bar}`}></div>

                    <h6 className={`${text} font-bold`}>{toast.title}</h6>

                    <p>{toast.content}</p>
                </motion.div>
            }
        </AnimatePresence>
    );
};

export default Toast;