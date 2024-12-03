"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { useOpenAppDataContext } from "@/providers/OpenAppProvider";
import { useSearchContext } from "@/providers/SearchProvider";
import { FiSearch } from "react-icons/fi";
import { usePathname } from "next/navigation";
import RenderCase from "../rendercase";
import { Button } from "@nextui-org/react";
import TooltipHorizon from "../tooltip";
import { useThemeContext } from "@/providers/ThemeProvider";
import { FaUser } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";

interface Props {
    openApp: boolean,
    isVisible: boolean,
}

const Taskbar: FC<Props> = ({ openApp, isVisible }) => {
    const intl = useIntl();
    const { setOpenApp } = useOpenAppDataContext();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { search, setSearch } = useSearchContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { theme } = useThemeContext()

    const divVariants = {
        hidden: {
            marginBottom: -56,
        },
        visible: {
            marginBottom: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
        },
    };

    useEffect(() => {
        const handleDocumentClick = (event: any) => {
            if (containerRef.current && containerRef.current.contains(event.target)) {
                setIsSearchFocused(true);
            } else setIsSearchFocused(false);
        };

        document.addEventListener("mousedown", handleDocumentClick);

        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, []);

    return (
        <motion.nav
            variants={divVariants}
            initial="hidden"
            animate={!openApp ? "visible" : isVisible ? "visible" : "hidden"}
            className={`!z-[45] w-full p-2`}
        >
            <div className='rounded-md h-12 backdrop-blur-xl flex gap-4 justify-between p-[1px]'>
                <div className={`w-full h-full border border-opacity-30 border-gray-200 flex place-items-center gap-2 pr-1 justify-end
                    rounded-md ${openApp ? "bg-white dark:bg-[#242526] shadow-[4px_-4px_10px_rgba(0,0,0,0.3)]" : "bg-white/60 dark:bg-[#242526]/50"}`}>
                    <RenderCase renderIf={pathname == "/menu"}>
                        <div className="pl-0.5 w-full">
                            <div
                                ref={containerRef}
                                className={`relative flex h-10 items-center rounded-l-[5px] overflow-clip text-blue-700 dark:text-white w-full xl:w-[225px]`}
                            >
                                <motion.button
                                    onClick={() => { }}
                                    className={`absolute text-xl h-8 w-8 px-2 flex justify-center 
                                    rounded-full place-items-center transition-all duration-500 ${isSearchFocused ? "bg-blue-500 dark:bg-[#242526] shadow-sm" : ""
                                        } transform`}
                                    initial={{ left: 2 }}
                                    animate={{
                                        left: isSearchFocused ? "calc(100% - 2rem - 6px)" : "4px",
                                    }}
                                >
                                    <FiSearch
                                        className={`h-4 w-4 dark:text-white ${isSearchFocused ? "text-white" : "text-blue-700"
                                            }`}
                                    />
                                </motion.button>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type="text"
                                    placeholder={intl.formatMessage({ id: "Search.Placeholder" })}
                                    className={`block h-full w-full text-sm bg-white/40 font-medium text-blue-700 outline-none 
                                    placeholder:!text-blue-700 dark:bg-[#3a3b3c] dark:text-white dark:placeholder:!text-white transition-all duration-500 ${isSearchFocused ? "pl-4" : "pl-10"
                                        }`}
                                    style={{
                                        borderTopRightRadius: "9999px",
                                        borderBottomRightRadius: isSearchFocused ? "9999px" : "0px",
                                    }}
                                />
                            </div>
                        </div>
                    </RenderCase>
                    <div className="pl-1.5 border-l-[0.5px] border-white/50">
                        <TooltipHorizon
                            content={<div className="dark:text-white text-blue-700 font-semibold"><FormattedMessage id="Settings.button2" /></div>} extra={`${openApp ? "bg-white dark:bg-[#242526]" : "bg-white/60 dark:bg-[#242526]/50"}`}>
                            <Button
                                onClick={() => setOpenApp({ openApp: true, appName: "settings" })}
                                className="avatar min-w-9 min-h-9 h-9 hover:scale-110 hover:-translate-y-1 w-9 rounded-full flex justify-center transition-all duration-300">
                                <RenderCase renderIf={theme == "dark"}>
                                    <img
                                        src='/avatar.jpg'
                                        alt="avatar"
                                        width={19200}
                                        height={10800}
                                        className="min-w-9 min-h-9 h-9 w-9 object-cover rounded-full"
                                    />
                                </RenderCase>
                                <RenderCase renderIf={theme == "light"}>
                                    <div className="min-w-9 min-h-9 h-9 w-9 bg-white/50 flex justify-center place-items-center" >
                                        <FaUser className="text-blue-700 h-8 w-9 mt-1" />
                                    </div>
                                </RenderCase>
                            </Button>
                        </TooltipHorizon>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Taskbar;
