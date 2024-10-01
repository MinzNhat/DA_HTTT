"use client";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { FC, Suspense, useEffect, useState } from "react";
import CustomLoadingElement from "./loading";
import useMobileView from "@/hooks/useMobileView";
import Taskbar from "@/components/taskbar";
import { motion } from "framer-motion";
import { useOpenAppDataContext } from "@/providers/OpenAppProvider";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import RenderCase from "@/components/rendercase";
import AppLayout from "@/components/applayout";
import LoadingUI from "@/components/loading";

interface Props {
    children: React.ReactNode
}

const RootStructure: FC<Props> = ({ children }) => {
    const { openApp, setOpenApp } = useOpenAppDataContext();
    const router = useRouter();
    const pathname = usePathname(); // Sử dụng usePathname để lấy đường dẫn hiện tại
    const [isVisible, setIsVisible] = useState(true);
    const [isTaskbarVisible, setIsTaskbarVisible] = useState(true);
    const { isMobile } = useMobileView();

    const divVariants = {
        hidden: (direction: number) => ({
            opacity: 0,
            y: direction == 0 ? 0 : direction > 0 ? 100 : -100,
        }),
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    useEffect(() => {
        if (pathname === "/menu") {
            setOpenApp({ openApp: false, appName: "/menu" });
        } else {
            setOpenApp({ openApp: true, appName: pathname });
        }
    }, [pathname, setOpenApp]);

    useEffect(() => {
        if (openApp.appName) {
            router.push(openApp.appName);
        }
    }, [openApp.appName]);

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

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <section className="flex h-full w-full">
                {/* Navbar & Main Content */}
                <div className="h-full w-full bg-[url('/hcmut.jpg')] bg-cover bg-center min-h-dvh">
                    {/* Main Content */}
                    <main className={`max-h-dvh h-dvh flex flex-col justify-center transition-all no-scrollbar relative overflow-clip`}>
                        <Navbar openApp={!(!openApp.openApp || !isVisible)} />

                        {/* Routes */}
                        <motion.div
                            variants={divVariants}
                            initial="hidden"
                            animate="visible"
                            custom={0}
                            className={`h-full grid mx-2 w-[calc(100dvw-16px)] z-10 overflow-y-scroll no-scrollbar transition-all duration-200 rounded-md ${(!openApp.openApp || !isVisible) ? "bg-white/10 backdrop-blur-sm dark:bg-[#242526]/30" : ""}`}>
                            <RenderCase renderIf={!openApp.openApp || pathname === "/menu"}>
                                <Suspense fallback={<CustomLoadingElement />}>{children}</Suspense>
                            </RenderCase>
                            <RenderCase renderIf={openApp.openApp && pathname !== "/menu"}>
                                <AppLayout isVisible={isVisible} setIsVisible={setIsVisible} onClose={() => { setOpenApp({ openApp: false, appName: "/menu" }); setIsVisible(true); }}>
                                    <Suspense fallback={<CustomLoadingElement />}>{children}</Suspense>
                                </AppLayout>
                            </RenderCase>
                        </motion.div>

                        <Taskbar openApp={!(!openApp.openApp || !isVisible)} isVisible={isTaskbarVisible} />
                    </main>
                </div>
            </section>
        </>
    );
};

export default RootStructure;
