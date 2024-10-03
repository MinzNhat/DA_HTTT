'use client'

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { FormattedMessage } from "react-intl";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import { FC, useState } from "react";
import InputField from "@/components/fields";
import { useBattery } from 'react-use';
import Progress from "@/components/progress";
import { BsFillLightningChargeFill } from "react-icons/bs";
import useCurrentTime from "@/hooks/useCurrentTime";
import { useThemeContext } from "@/providers/ThemeProvider";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import RenderCase from "@/components/rendercase";
import { useUserAuthContext } from "@/providers/AuthProvider";
import NotiPopup from "@/components/notification";
import LoadingUI from "@/components/loading";

interface Props {
    params: {
        uid: string;
        token: string;
    };
}

const ForgotPasswordPage: FC<Props> = ({ params }) => {
    const { uid, token } = params;
    const router = useRouter();
    const battery = useBattery() as any;
    const formattedTime = useCurrentTime();
    const { loading, confirmForgot } = useUserAuthContext();
    const { theme, setTheme } = useThemeContext();
    const [errorField, setErrorField] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [openSubmitNotification, setOpenSubmitNotification] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const { isSupported, level, charging, dischargingTime, chargingTime } = battery;

    const divVariants = {
        hidden: (direction: number) => ({
            opacity: 0,
            y: direction > 0 ? 100 : -100,
        }),
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };


    const submit = async () => {
        if (!password) {
            setMessage("Vui lòng điền mật khẩu mới")
            setOpenNotification(true)
            setErrorField(true)
            return;
        }

        setErrorField(false)

        const error = await confirmForgot(uid, token, password)
        if (!loading && !error) {
            setMessage("Đổi mật khẩu thành công, nhấn đóng để quay về trang đăng nhập")
            setOpenSubmitNotification(true)
        } else if (!loading && error) {
            setMessage("Đổi mật khẩu thành công, link đã quá hạn, vui lòng yêu cầu và thử lại")
            setOpenNotification(true)
        }
    }

    return (
        <section className="flex h-dvh w-full relative justify-center place-items-center flex-col gap-4 no-scrollbar">

            <RenderCase renderIf={openNotification}>
                <NotiPopup message={message} onClose={() => setOpenNotification(false)} />
            </RenderCase>

            <RenderCase renderIf={openSubmitNotification}>
                <NotiPopup message={message} onClose={() => { setOpenSubmitNotification(false); router.push("/") }} />
            </RenderCase>

            <motion.div
                variants={divVariants}
                initial="hidden"
                animate="visible"
                custom={-1}
                className="h-12 w-11/12 md:w-2/3 lg:w-7/12 z-[45] flex gap-4 rounded-xl bg-white/50 p-2 backdrop-blur-xl dark:bg-[#0b14374d] px-6 justify-between"
            >
                <button className="text-sm font-semibold text-blue-600 hover:text-brand-600 dark:text-white visible flex place-items-center w-1/3"
                    onClick={() => { () => { router.push("/") } }}>
                    <>Đăng nhập</>
                </button>

                <div className="text-md font-semibold text-blue-600 dark:text-white flex place-items-center w-1/3 justify-center">
                    {formattedTime ?? "00:00:00"}
                </div>

                <div className="flex place-items-center w-1/3 justify-end gap-2">
                    <div className="w-10 flex justify-center place-items-center relative">
                        <Progress value={level && typeof level == "number" ? level * 100 : 40} color="blue" />
                        <div className="absolute text-white"><BsFillLightningChargeFill /></div>
                    </div>
                    <div className="text-blue-600 dark:text-white font-semibold">
                        {level && typeof level == "number" ? (level * 100).toFixed(2) : 40}%
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={divVariants}
                initial="hidden"
                animate="visible"
                custom={1}
                className={`w-11/12 md:w-2/3 lg:w-7/12 h-5/6 md:h-2/3 transition-all duration-1000 z-[45] flex  gap-4 rounded-xl bg-white/50 p-2 backdrop-blur-xl dark:bg-[#0b14374d]`}
            >
                <div className="w-full h-full flex flex-col justify-between p-4 gap-4 overflow-y-auto no-scrollbar">
                    <div className="flex flex-col gap-2 pr-32 lg:pr-40">
                        <div className="flex gap-3">
                            <h4 className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-white flex justify-between whitespace-nowrap">
                                <FormattedMessage id="Login.Login7" />
                            </h4>

                            <div
                                className="cursor-pointer text-gray-600 mt-1.5 hidden sm:block"
                                onClick={() => {
                                    theme === "dark" ? setTheme("light") : setTheme("dark");
                                }}
                            >
                                {theme === "dark" ? (
                                    <RiSunFill className="md:h-10 md:w-10 h-7 w-7 text-blue-700 dark:text-white" />
                                ) : (
                                    <RiMoonFill className="md:h-10 md:w-10 h-7 w-7 text-blue-700 dark:text-white" />
                                )}
                            </div>
                        </div>

                        <p className="pl-1 text-lg text-[#030391] dark:text-gray-200">
                            <FormattedMessage id="Login.Login8" />
                        </p>
                    </div>

                    <AnimatePresence initial={false}>
                        <motion.div
                            key="option0"
                            className="w-full h-full"
                            initial={{ scale: 0, height: "0" }}
                            animate={{ scale: 1, height: "auto" }}
                            exit={{ scale: 0, height: "0" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="w-full flex flex-col justify-center h-full gap-4">

                                <InputField
                                    variant={false}
                                    label="Mật khẩu"
                                    placeholder="Nhập mật khẩu"
                                    id="password"
                                    type="password"
                                    state={errorField && !password ? "error" : "none"}
                                    value={password}
                                    setValue={setPassword}
                                    className="bg-white dark:!bg-[#3a3b3c]"
                                />

                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <button
                        onClick={loading ? () => { } : submit}
                        className="linear w-full rounded-xl bg-brand-500 -mt-4 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    >
                        <RenderCase renderIf={!loading}>
                            <>Đổi mật khẩu</>
                        </RenderCase>


                        <RenderCase renderIf={loading}>
                            <div className="w-full flex justify-center place-items-center">
                                <LoadingUI />
                            </div>
                        </RenderCase>
                    </button>
                    <div className="ribbon z-20 absolute bg-white dark:bg-[#3a3b3c] transition-all shadow-3xl duration-1000 -top-2 right-4 -scale-x-100">
                        <div className="w-16 lg:w-[108px] h-28 lg:h-[108px] flex flex-col pt-4 sm:pt-0 gap-2 place-items-center transition-all duration-1000 -scale-x-100">
                            <Image src="/logo.ico" alt="Your image" width={250} height={250} />
                            <div
                                className="cursor-pointer text-gray-600 mt-1.5 block sm:hidden"
                                onClick={() => {
                                    theme === "dark" ? setTheme("light") : setTheme("dark");
                                }}
                            >
                                {theme === "dark" ? (
                                    <RiSunFill className="md:h-10 md:w-10 h-6 w-6 sm:text-blue-700 text-[#1488DB] dark:text-white" />
                                ) : (
                                    <RiMoonFill className="md:h-10 md:w-10 h-6 w-6 sm:text-blue-700 text-[#1488DB] dark:text-white" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="absolute right-0 w-full h-screen z-0">
                <Carousel
                    additionalTransfrom={0}
                    draggable
                    keyBoardControl
                    autoPlay
                    showDots={false}
                    autoPlaySpeed={3000}
                    shouldResetAutoplay={true}
                    swipeable
                    minimumTouchDrag={80}
                    responsive={{
                        res1: {
                            breakpoint: { max: 40000, min: 0 },
                            items: 1,
                            partialVisibilityGutter: 0,
                        },
                    }}
                    containerClass="flex h-full w-full"
                    rewind={true}
                    pauseOnHover={false}
                    rewindWithAnimation={true}
                    arrows={false}
                    transitionDuration={1000}
                >
                    <div className="h-screen">
                        <Image
                            src={"/auth.png"}
                            alt="Image"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="h-screen">
                        <Image
                            src={"/hcmut.jpg"}
                            alt="Image"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
export default ForgotPasswordPage;