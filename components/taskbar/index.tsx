"use client";

import { FC } from "react";
import { motion } from 'framer-motion';
import { useOpenAppDataContext } from "@/providers/OpenAppProvider";

interface Props {
    openApp: boolean,
    isVisible: boolean,
}

const Taskbar: FC<Props> = ({ openApp, isVisible }) => {
    const { setOpenApp } = useOpenAppDataContext();

    const divVariants = {
        hidden: {
            marginBottom: -56,
        },
        visible: {
            marginBottom: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
        },
    };

    return (
        <motion.nav
            variants={divVariants}
            initial="hidden"
            animate={!openApp ? "visible" : isVisible ? "visible" : "hidden"}
            className={`z-[45] w-full p-2`}
        >
            <div className='rounded-md h-12 backdrop-blur-xl flex gap-4 justify-between p-[1px]'>
                <div className={`w-full h-full border border-opacity-30 border-gray-200 
                    rounded-md ${openApp ? "bg-white dark:bg-[#242526] shadow-[4px_-4px_10px_rgba(0,0,0,0.3)]" : "bg-white/10 dark:bg-[#242526]/50"}`}>
                </div>
            </div>
        </motion.nav>
    );
};

export default Taskbar;
