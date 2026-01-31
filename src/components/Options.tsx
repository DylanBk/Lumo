'use client';

import { useEffect, useRef } from "react";
import { FocusTrap } from "focus-trap-react";

type Props = {
    options: {
        label: string;
        action: () => void;
    }[];
    onClose: () => void;
    disableClose?: boolean;
};

const Options = (props: Props) => {
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (props.disableClose) return;
            if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) props.onClose();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') props.onClose();
        };

        document.addEventListener('mousedown', handleClick);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [props]);

    return (
        <div
            ref={optionsRef}
            className="absolute right-[-5.5rem] rounded-md shadow bg-surface-muted">
            <FocusTrap>
                <div>
                    {
                        props.options.map((o, i) => (
                            <div
                            key={i}
                            className="p-2 first:rounded-t-md last:rounded-b-md outline-none cursor-pointer hover:bg-[var(--border-strong)] focus:bg-[var(--border-strong)]"
                            tabIndex={0}
                            onClick={o.action}
                            onKeyDown={(e) => e.key === 'Enter' && o.action()}>
                                {o.label}
                            </div>
                        ))
                    }
                </div>
            </FocusTrap>
        </div>
    );
};

export default Options;