"use client";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import RenderCase from "../rendercase";
import Container from "../container";

interface PopupProps {
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    className?: string;
    customWidth?: string;
    icon?: React.ReactNode;
    noPadding?: boolean;
}

const DetailPopup = ({ onClose, children, title, className, customWidth, icon, noPadding }: PopupProps) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };
    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <motion.div
            className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000]
            bg-opacity-10 dark:bg-white dark:bg-opacity-5 z-50 p-2 max-h-dvh h-dvh w-dvw max-w-dvw`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                backdropFilter: "blur(6px)",
            }}
            onAnimationComplete={handleAnimationComplete}
        >
            <motion.div
                ref={notificationRef}
                className={`relative w-full max-h-full max-w-full flex flex-col justify-center items-center overflow-auto
                ${customWidth ? customWidth : "sm:w-11/12"}`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Container className="!rounded-lg overflow-clip flex-grow w-full">
                    <div className="max-h-10 bg-white dark:bg-[#242526] h-10 grid grid-cols-2 md:grid-cols-3 place-items-center px-2 rounded-t-md">
                        <div className="text-[#000000] dark:text-white flex justify-start gap-2 w-full">
                            <RenderCase renderIf={!!icon}>
                                <div className="min-h-5 min-w-5 flex justify-center place-items-center">{icon}</div>
                            </RenderCase>
                            <div className="md:hidden text-md font-semibold text-black dark:text-white whitespace-nowrap truncate">
                                {title}
                            </div>
                        </div>

                        <div className="hidden md:block text-md font-semibold text-black dark:text-white whitespace-nowrap">
                            {title}
                        </div>

                        <div className="flex flex-row-reverse gap-3 justify-start w-full">
                            <button
                                onClick={handleClose}
                                className="linear w-6 h-6 rounded-full text-base dark:text-white transition duration-200 flex justify-center
                                place-items-center hover:bg-utilsPrimary hover:dark:bg-gray-200 hover:text-white hover:dark:text-black"
                            >
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className={`overflow-y-auto max-h-[calc(100dvh-56px)] max-w-full min-h-20 rounded-b-sm no-scrollbar
                        ${noPadding ? '' : 'px-2 pb-2'}`}>
                        <div className={`w-full h-full ${className} rounded-b-sm`}>
                            {children}
                        </div>
                    </div>
                </Container>
            </motion.div>
        </motion.div>,
        document.body
    );
};

export default DetailPopup;