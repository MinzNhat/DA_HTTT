'use client'

import "@/app/globals.css";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Taskbar from "@/components/taskbar";
import CustomLoadingElement from "./loading";
import AppLayout from "@/components/applayout";
import RenderCase from "@/components/rendercase";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FC, Suspense, useEffect, useState } from "react";
import { useOpenAppDataContext } from "@/providers/OpenAppProvider";
import { Button } from "@nextui-org/button";
import { RiRobot3Line } from "react-icons/ri";
import DetailPopup from "@/components/popup";
import ChatMain from "./analysis/components/MainPage";

interface Props {
    children: React.ReactNode;
}

const RootStructure: FC<Props> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialLocale = searchParams.get('locale') || 'vi';
    const [isVisible, setIsVisible] = useState(true);
    const { openApp, setOpenApp } = useOpenAppDataContext();
    const [isTaskbarVisible, setIsTaskbarVisible] = useState(true);
    const [openGPT, setOpenGPT] = useState(false);
    const [messages, setMessages] = useState([
        { type: "bot", content: <p>Chào bạn! Tôi có thể giúp gì cho bạn?</p> },
    ]);

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
            router.push(`${openApp.appName}?locale=${initialLocale}`);
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

    return (
        <section className="flex w-full max-h-dvh h-dvh overflow-clip">
            <RenderCase renderIf={openGPT}>
                <DetailPopup onClose={() => setOpenGPT(!openGPT)} title="Analysis" icon={<RiRobot3Line className="w-5 h-5" />}>
                    <ChatMain messages={messages} setMessages={setMessages} />
                </DetailPopup>
            </RenderCase>
            <div className="w-full bg-[url('/hcmut.jpg')] bg-cover bg-center max-h-dvh h-dvh">
                <main className={`max-h-dvh h-dvh flex flex-col justify-center transition-all relative duration-500 backdrop-blur-lg bg-black/50 dark:bg-black/40`}>
                    <Navbar openApp={!(!openApp.openApp || !isVisible)} />

                    {/* Routes */}
                    <motion.div
                        variants={divVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        className={`flex mx-2 w-[calc(100dvw-16px)] h-full transition-colors duration-500 ease-in-out rounded-md relative overflow-y-auto no-scrollbar`}
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

                        <Button
                            onClick={() => setOpenGPT(!openGPT)}
                            className={`${pathname === "/menu" ? "right-1 bottom-0" : "right-4 bottom-4 transform hover:scale-125"} z-30 absolute border-2 bg-white dark:bg-[#242526]  h-10 w-10 p-2 min-w-10 text-black dark:text-white 
                                border-gray-300 dark:border-white rounded-full transition-all duration-300 ease-in-out`}
                        >
                            <motion.div
                                whileHover={{ rotate: -10, transition: { yoyo: Infinity, duration: 0.3 } }}
                            >
                                <RiRobot3Line className="w-5 h-5" />
                            </motion.div>
                        </Button>
                    </motion.div>

                    <Taskbar openApp={!(!openApp.openApp || !isVisible)} isVisible={isTaskbarVisible} />
                </main>
            </div>
        </section>
    );
};

export default RootStructure;
