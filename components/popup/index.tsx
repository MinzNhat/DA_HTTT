"use client"
import React, { useRef, useState, FC } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import ReactDOM from "react-dom";

interface Props {
    onClose: () => void;
    title: string;
    children: any;
    className?: string;
    className2?: string;
    button?: any;
}

const DetailPopup: FC<Props> = ({ onClose, children, title, className, className2, button }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };
    return ReactDOM.createPortal(
        <motion.div
            className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000] 
                bg-opacity-10 dark:bg-white dark:bg-opacity-5 z-50 p-4`}
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
                className={`relative w-full  dark:bg-[#242526] bg-white rounded-xl p-4 
                    ${className2 ? className2 : "sm:w-9/12"}`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative items-center justify-center flex-col flex h-10 w-full border-b-2 
                border-gray-200 dark:!border-[#3A3B3C] overflow-hidden">

                    <div className="font-bold text-lg sm:text-xl mb-2 w-full text-left md:text-center 
                    md:px-10 pr-10 line-clamp-1 text-[#000000] dark:text-white">
                        {title}
                    </div>

                    <button
                        className="absolute right-0 w-8 h-8 top-0 rounded-full mb-2 hover:bg-gray-200 dark:hover:text-navy-900 flex justify-center place-items-center"
                        onClick={handleClose}
                    >
                        <IoMdClose className="w-5/6 h-5/6 text-[#000000] dark:text-white dark:hover:text-[#242526]" />
                    </button>
                </div>

                <div className={`max-h-[calc(100dvh-140px)] relative flex flex-col dark:text-white w-full overflow-y-scroll rounded-sm no-scrollbar ${className ? className : "pt-4"}`}>
                    {children}
                </div>

                {button}
            </motion.div>
        </motion.div>
        ,
        document.body
    );
};

export default DetailPopup;
