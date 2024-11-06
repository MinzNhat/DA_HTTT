"use client";

import { useEffect } from "react";

type ClickOutsideAlerterProps = {
    ref: React.RefObject<HTMLElement>;
    setState?: React.Dispatch<React.SetStateAction<boolean>>;
    action?: () => void;
};

export const useHandleClickOutsideAlerter = ({ ref, setState, action }: ClickOutsideAlerterProps) => {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent | FocusEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                if (setState) {
                    setState(false);
                }
                if (action) {
                    action();
                }
            }
        }

        const events: Array<keyof DocumentEventMap> = ["mousedown", "focusin"];
        events.forEach((event) => document.addEventListener(event, handleClickOutside));

        return () => {
            events.forEach((event) => document.removeEventListener(event, handleClickOutside));
        };
    }, [ref, setState, action]);
};
