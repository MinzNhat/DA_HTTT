'use client'

import MusicApp from "./musicApp";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
import { apps } from "../data/appList";
import { useState, useEffect } from "react";
import RenderCase from "@/components/rendercase";
import { useSearchContext } from "@/providers/SearchProvider";
import { useOpenAppDataContext } from "@/providers/OpenAppProvider";
import { FormattedMessage, useIntl } from "react-intl";

const MenuList = () => {
    const intl = useIntl();
    const { search } = useSearchContext();
    const { setOpenApp } = useOpenAppDataContext();
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [profileHeight, setProfileHeight] = useState<number | null>(null);

    const debounceSearch = debounce((value: string) => {
        setDebouncedSearch(value);
    }, 300);

    useEffect(() => {
        debounceSearch(search);
    }, [search]);

    useEffect(() => {
        const profileElement = document.querySelector('.profile-element');

        if (profileElement) {
            const observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.contentRect.height != 0) setProfileHeight(entry.contentRect.height);
                }
            });

            observer.observe(profileElement);

            return () => {
                observer.disconnect();
            };
        }
    }, []);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
            {apps
                .filter(app => intl.formatMessage({ id: `app.${app.name.toLowerCase().replace(' ', '')}` }).toLowerCase().includes(debouncedSearch.toLowerCase()))
                .map((app, index) => (
                    <motion.div
                        key={app.id}
                        className={`flex flex-col gap-2 !h-full !w-full justify-center place-items-center ${app.className}`}
                        initial={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <div
                            className={`${app.className} ${app.name === "Special Offer" ? 'profile-element' : ''} flex flex-col items-center justify-center w-full 
                            backdrop-blur-xl bg-white/70 lg:bg-white/80 dark:bg-[#242526]/70 rounded-lg shadow-lg cursor-pointer`}
                            style={{
                                ...(app.name === "Territory" && profileHeight ? { height: profileHeight } : {}),
                                ...(app.name === "Music" ? { height: '100%', maxHeight: profileHeight ? `${profileHeight * 2 + 24}px` : 'none' } : {}),
                            }}
                            onClick={() => { app.name !== "Music" ? setOpenApp({ appName: app.link, openApp: true }) : null }}
                        >
                            <RenderCase renderIf={app.name === "Music"}>
                                <MusicApp />
                            </RenderCase>

                            <RenderCase renderIf={app.name !== "Music"}>
                                <>
                                    <app.icon className="text-4xl lg:text-6xl mb-2 dark:text-white text-blue-700 h-full pt-10 min-h-6 min-w-6" />
                                    <span className="text-md font-semibold mb-2 dark:text-white text-blue-700 justify-self-end h-10"><FormattedMessage id={`app.${app.name.toLowerCase().replace(' ', '')}`} /></span>
                                </>
                            </RenderCase>
                        </div>
                    </motion.div>
                ))}
        </div>
    );
};

export default MenuList;
