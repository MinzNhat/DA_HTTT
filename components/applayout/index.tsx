"use client"
import React, { useRef, useState, FC, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import ReactDOM from "react-dom";
import { usePathname } from "next/navigation";
import routes from "@/data/routes";
import { FormattedMessage } from "react-intl";

interface Props {
    onClose: () => void;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const AppLayout: FC<Props> = ({ onClose, isVisible, setIsVisible, children }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const [icon, setIcon] = useState<JSX.Element>(<></>)
    const [currentRoute, setCurrentRoute] = useState("Loading...");

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const getActiveRoute = (routes: any) => {
        const activeRoute = routes.find(route => pathname.includes(route.path));

        if (activeRoute) {
            setCurrentRoute(activeRoute.path);
            setIcon(activeRoute.icon);
        } else {
            setCurrentRoute("menu");
            setIcon(<></>);
        }
    };

    useEffect(() => {
        getActiveRoute(routes);
    }, [pathname]);

    return <motion.div
        className={`flex items-center justify-center shadow-[1px_-1px_10px_rgba(0,0,0,0.1)] 
        dark:shadow-none rounded-md relative h-full w-full`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
        onAnimationComplete={handleAnimationComplete}
    >
        <motion.div
            ref={notificationRef}
            className={`w-full h-full rounded-md flex flex-col shadow-[1px_-1px_10px_rgba(0,0,0,0.1)] bg-white dark:bg-[#242526]`}
            initial={{ scale: 0 }}
            animate={{ scale: isVisible ? 1 : 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.7 }}
        >
            <div className="min-h-10 bg-white dark:bg-[#242526] h-10 grid grid-cols-2 md:grid-cols-3 place-items-center px-3 rounded-t-md">
                <div className="text-[#000000] dark:text-white w-full flex justify-start gap-2">
                    <div className="min-h-5 min-w-5">{icon}</div>
                    <div className="md:hidden text-md font-semibold text-[#000000] dark:text-white whitespace-nowrap truncate">
                        <FormattedMessage id={`routes.${currentRoute}`} />
                    </div>
                </div>

                <div className="hidden md:block text-md font-semibold text-[#000000] dark:text-white whitespace-nowrap">
                    <FormattedMessage id={`routes.${currentRoute}`} />
                </div>

                <div className="flex flex-row-reverse gap-3 justify-start w-full">
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

            <div className={`w-full rounded-b-md relative overflow-y-auto no-scrollbar flex justify-center place-items-center h-full`}>
                {children}
            </div>
        </motion.div>
    </motion.div>;
};

export default AppLayout;
