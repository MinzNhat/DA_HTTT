"use client"
import React, { useRef, useState, FC } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import ReactDOM from "react-dom";

interface Props {
    onClose: () => void;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const AppLayout: FC<Props> = ({ onClose, isVisible, setIsVisible, children }) => {
    const notificationRef = useRef<HTMLDivElement>(null);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return <motion.div
        className={`w-full h-full flex items-center justify-center z-40 shadow-[1px_-1px_10px_rgba(0,0,0,0.1)] 
            dark:shadow-none rounded-md`}
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
            className={`relative w-full h-full rounded-md flex flex-col shadow-[1px_-1px_10px_rgba(0,0,0,0.1)]`}
            initial={{ scale: 0 }}
            animate={{ scale: isVisible ? 1 : 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-white dark:bg-[#242526] h-10 flex justify-end place-items-center px-3 rounded-t-md">
                <div className="flex flex-row-reverse gap-3">
                    <button
                        onClick={handleClose}
                        className="linear w-4 h-4 rounded-full bg-red-500 text-base font-medium text-white transition duration-200 
                    hover:bg-red-600 active:bg-red-700 "
                    />
                    <button
                        className="linear w-4 h-4 rounded-full bg-yellow-500 text-base font-medium text-white transition duration-200 
                    hover:bg-yellow-600 active:bg-yellow-700 "
                    />
                    <button
                        className="linear w-4 h-4 rounded-full bg-green-500 text-base font-medium text-white transition duration-200 
                    hover:bg-green-600 active:bg-green-700 "
                    />
                </div>

            </div>
            <div className="w-full h-full bg-lightPrimary dark:bg-[#242526]/90 overflow-y-auto no-scrollbar rounded-b-md">
                {children}
            </div>
        </motion.div>
    </motion.div>;
};

export default AppLayout;
