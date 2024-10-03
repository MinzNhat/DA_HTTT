'use client'

import "@/app/globals.css";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Taskbar from "@/components/taskbar";
import CustomLoadingElement from "./loading";
import AppLayout from "@/components/applayout";
import RenderCase from "@/components/rendercase";
import { useRouter, usePathname } from "next/navigation";
import { FC, Suspense, useEffect, useState } from "react";
import { useOpenAppDataContext } from "@/providers/OpenAppProvider";

interface Props {
    children: React.ReactNode;
}

const RootStructure: FC<Props> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const { openApp, setOpenApp } = useOpenAppDataContext();
    const [isTaskbarVisible, setIsTaskbarVisible] = useState(true);

    const handleCloseAppLayout = () => {
        setOpenApp({ openApp: false, appName: "/menu" });
        setIsVisible(true);
    }

    const divVariants = {
        hidden: (direction: number) => ({
            opacity: 0,
            y: direction == 0 ? 0 : direction > 0 ? 100 : -100,
        }),
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
        },
    };

    useEffect(() => {
        if (openApp.appName) {
            router.push(openApp.appName);
        }
    }, [openApp.appName]);

    useEffect(() => {
        if (pathname === "/menu") {
            setOpenApp({ openApp: false, appName: "/menu" });
        } else {
            setOpenApp({ openApp: true, appName: pathname });
        }
    }, [pathname, setOpenApp]);

    useEffect(() => {
        let hideTimeout: NodeJS.Timeout;

        if (openApp.openApp) {
            hideTimeout = setTimeout(() => {
                setIsTaskbarVisible(false);
            }, 1000);
        } else {
            setIsTaskbarVisible(true);
        }

        return () => clearTimeout(hideTimeout);
    }, [openApp.openApp]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const windowHeight = window.innerHeight;
            const mouseY = event.clientY;

            if (mouseY >= windowHeight - 100) {
                setIsTaskbarVisible(true);
            } else {
                setIsTaskbarVisible(false);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section className="flex w-full max-h-dvh h-dvh overflow-clip">
            <div className="w-full bg-[url('/hcmut.jpg')] bg-cover bg-center max-h-dvh h-dvh">
                <main className="max-h-dvh h-dvh flex flex-col justify-center transition-all relative">
                    <Navbar openApp={!(!openApp.openApp || !isVisible)} />

                    {/* Routes */}
                    <motion.div
                        variants={divVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className="flex mx-2 w-[calc(100dvw-16px)] h-full transition-colors duration-10000 ease-in-out bg-white/10 
                            backdrop-blur-sm dark:bg-[#242526]/30 rounded-md relative overflow-y-auto no-scrollbar"
                    >
                        <RenderCase renderIf={pathname === "/menu"}>
                            <Suspense fallback={<CustomLoadingElement />}>{children}</Suspense>
                        </RenderCase>

                        <RenderCase renderIf={openApp.openApp && pathname !== "/menu"}>
                            <AppLayout
                                isVisible={isVisible}
                                setIsVisible={setIsVisible}
                                onClose={handleCloseAppLayout}
                            >
                                <Suspense fallback={<CustomLoadingElement />}>{children}</Suspense>
                            </AppLayout>
                        </RenderCase>
                    </motion.div>

                    <Taskbar openApp={!(!openApp.openApp || !isVisible)} isVisible={isTaskbarVisible} />
                </main>
            </div>
        </section>
    );
};

export default RootStructure;
