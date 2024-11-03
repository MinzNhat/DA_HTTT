import React, { useRef, useEffect, useState, FC } from "react";
import { motion } from "framer-motion";
import { FormattedMessage } from "react-intl";
import ReactDOM from "react-dom";

interface Props {
    onClose: () => void;
    message: string | JSX.Element;
    name?: string
}

const NotiPopup: FC<Props> = ({ onClose, message, name }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = (event?: React.MouseEvent<HTMLButtonElement>) => {
        if (event) {
            event.preventDefault();
        }
        setIsVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 flex backdrop-blur-sm items-center 
            justify-center bg-[#000000] dark:bg-white/30 bg-opacity-50 z-[100] inset-0 px-4"

            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={handleAnimationComplete}
        >
            <motion.div
                ref={notificationRef}
                className="relative min-w-full sm:min-w-[300px] sm:max-w-screen max-h-[80vh] 
                md:max-w-96 bg-white dark:bg-[#242526] rounded-xl p-4 flex flex-col shadow"
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-[#000000] dark:text-white text-xl font-bold mb-2 text-center">
                    {name ?? <FormattedMessage id="Notification.Title" />}
                </h2>

                <div className="overflow-scroll max-h-full w-full no-scrollbar">
                    <p className="text-[#000000] dark:text-white w-full text-center">
                        {message}
                    </p>
                </div>

                <div className="flex w-full justify-end gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className=" mt-4 px-4 py-2 truncate h-10 rounded-md overflow-clip text-white 
                        bg-brand-500 hover:bg-brand-600 active:bg-brand-700 hover:cursor-pointer flex"
                        onClick={(event) => handleClose(event)}
                    >
                        <FormattedMessage id="Notification.Close" />
                    </motion.button>
                </div>

            </motion.div>
        </motion.div>
        , document.body
    )
};

export default NotiPopup;