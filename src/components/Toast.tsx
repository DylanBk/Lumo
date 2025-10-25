'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    title: string;
    context: "info" | "success" | "warning" | "error";
    content: string;
    visible: boolean;
    onClose: () => void;
};

const Toast = (props: Props) => {
    const [bar, setBar] = useState<string>('bg-blue-500');
    const [text, setText] = useState<string>('text-blue-500');

    useEffect(() => {
        switch(props.context) {
            case "info":
                setBar('bg-blue-500');
                setText('text-blue-500');
                break;
            case "success":
                setBar('bg-green-500');
                setText('text-green-500');
                break;
            case "warning":
                setBar('bg-yellow-500');
                setText('text-yellow-500');
                break;
            case "error":
                setBar('bg-red-500');
                setText('text-red-500');
                break;
            default:
                setBar('bg-blue-500');
                setText('text-blue-500');
                console.error('Invalid toast context:', props.context);
        };

        const timer = setTimeout(() => {
            props.onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [props]);

    return (
        <AnimatePresence>
            {props.visible &&
                <motion.div
                    className={`absolute right-8 bottom-4 flex flex-col p-4 rounded-md bg-surface border border-border`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    layout>
                    <div className={`h-2 w-full absolute left-0 top-0 rounded-t-md ${bar}`}></div>

                    <h6 className={`${text} font-bold`}>{props.title}</h6>

                    <p>{props.content}</p>
                </motion.div>
            }
        </AnimatePresence>
    );
};

export default Toast;