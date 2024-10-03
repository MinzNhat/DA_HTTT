'use client'

import { AnimatePresence, motion } from "framer-motion";
import { FormattedMessage, useIntl } from "react-intl";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import { useState } from "react";
import InputField from "@/components/fields";
import Checkbox from "@/components/checkbox";
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
import LanguageSwitcher from "@/components/language";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const intl = useIntl()
  const router = useRouter()
  const battery = useBattery() as any;
  const formattedTime = useCurrentTime();
  const searchParams = useSearchParams();
  const initialLocale = searchParams.get('locale') || (typeof window !== 'undefined' && window.localStorage) ? localStorage.getItem('locale') : 'vi';
  const { loading, login, register, forgot } = useUserAuthContext();
  const { theme, setTheme } = useThemeContext();
  const [errorField, setErrorField] = useState<boolean>(false);
  const [form, setCurrentForm] = useState<number>(0);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openSubmitNotification, setOpenSubmitNotification] = useState<boolean>(false);
  const [openSubmitNotification2, setOpenSubmitNotification2] = useState<boolean>(false);
  const emailRegex = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9._-]{1,255}\.[a-zA-Z]{2,4}$/;
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
    if (!account || (form != 2 && !password) || (form == 1 && (!password2 || !name))) {
      setMessage(intl.formatMessage({ id: "Login.Message1" }))
      setErrorField(true)
      setOpenNotification(true)
      return;
    } else if (!emailRegex.test(account)) {
      setMessage(intl.formatMessage({ id: "Login.Message2" }))
      setErrorField(true)
      setOpenNotification(true)
      return;
    }

    if (form == 1 && password != password2) {
      setMessage(intl.formatMessage({ id: "Login.Message3" }))
      setErrorField(true)
      setOpenNotification(true)
      return;
    }

    setErrorField(false)

    if (form == 0) {
      const error = await login(account, password, rememberMe)
      if (!loading && !error) {
        setMessage(intl.formatMessage({ id: "Login.Message4" }))
        setOpenSubmitNotification(true)
      } else if (!loading && error) {
        setMessage(intl.formatMessage({ id: "Login.Message5" }))
        setOpenNotification(true)
      }
    } else if (form == 1) {
      const error = await register(name, account, password, password2)
      if (!loading && !error) {
        setMessage(intl.formatMessage({ id: "Login.Message6" }))
        setOpenSubmitNotification2(true)
      } else if (!loading && error) {
        setMessage(intl.formatMessage({ id: "Login.Message7" }))
        setOpenNotification(true)
      }
    } else if (form == 2) {
      const error = await forgot(account)
      if (!loading && !error) {
        setMessage(intl.formatMessage({ id: "Login.Message8" }))
        setOpenSubmitNotification2(true)
      } else if (!loading && error) {
        setMessage(intl.formatMessage({ id: "Login.Message9" }))
        setOpenNotification(true)
      }
    }
  }

  return (
    <section className="flex h-dvh w-full relative justify-center place-items-center flex-col gap-4 no-scrollbar overflow-clip">

      <RenderCase renderIf={openNotification}>
        <NotiPopup message={message} onClose={() => setOpenNotification(false)} />
      </RenderCase>

      <RenderCase renderIf={openSubmitNotification}>
        <NotiPopup message={message} onClose={() => { setOpenSubmitNotification(false); router.push(`/menu?locale=${initialLocale}`) }} />
      </RenderCase>

      <RenderCase renderIf={openSubmitNotification2}>
        <NotiPopup message={message} onClose={() => { setCurrentForm(0); setOpenSubmitNotification2(false); }} />
      </RenderCase>

      <motion.div
        variants={divVariants}
        initial="hidden"
        animate="visible"
        custom={-1}
        className="h-12 w-11/12 md:w-2/3 lg:w-7/12 z-[45] flex gap-4 rounded-xl bg-white/50 p-2 backdrop-blur-xl dark:bg-[#0b14374d] px-6 justify-between"
      >
        <button className="text-sm font-semibold text-blue-600 hover:text-brand-600 dark:text-white visible flex place-items-center w-1/3"
          onClick={() => { loading ? () => { } : (form == 0 ? setCurrentForm(1) : setCurrentForm(0)) }}>
          <RenderCase renderIf={form != 0}>
            <FormattedMessage id="Login.Login" />
          </RenderCase>

          <RenderCase renderIf={form == 0}>
            <FormattedMessage id="Login.SignUp" />
          </RenderCase>
        </button>

        <div className="text-md font-semibold text-blue-600 dark:text-white flex place-items-center w-1/3 justify-center gap-1">
          {formattedTime ?? "00:00:00"}
        </div>

        <div className="flex place-items-center w-1/3 justify-end gap-2">
          <LanguageSwitcher />
          <div className="w-10 flex justify-center place-items-center relative h-96">
            <Progress value={level && typeof level == "number" ? level * 100 : 40} color="blue" />
            <div className="absolute text-white"><BsFillLightningChargeFill /></div>
          </div>
          <div className="text-blue-600 dark:text-white font-semibold hidden sm:block">
            {level && typeof level == "number" ? (level * 100).toFixed(0) : 40}%
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={divVariants}
        initial="hidden"
        animate="visible"
        custom={1}
        className={`w-11/12 md:w-2/3 lg:w-7/12 h-5/6 ${form == 1 ? "md:h-5/6" : "md:h-2/3"} transition-all duration-1000 z-[5] flex  gap-4 rounded-xl bg-white/50 p-2 backdrop-blur-xl dark:bg-[#0b14374d]`}
      >
        <div className="w-full h-full flex flex-col justify-between p-4 gap-4 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-2 pr-32 lg:pr-40">
            <div className="flex gap-3">
              <h4 className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-white flex justify-between whitespace-nowrap">
                <RenderCase renderIf={form == 0}><FormattedMessage id="Login.Login" /></RenderCase>
                <RenderCase renderIf={form == 1}><FormattedMessage id="Login.Login3" /></RenderCase>
                <RenderCase renderIf={form == 2}><FormattedMessage id="Login.Login5" /></RenderCase>
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
              <RenderCase renderIf={form == 0}><FormattedMessage id="Login.Login2" /></RenderCase>
              <RenderCase renderIf={form == 1}><FormattedMessage id="Login.Login4" /></RenderCase>
              <RenderCase renderIf={form == 2}><FormattedMessage id="Login.Login6" /></RenderCase>
            </p>
          </div>

          <AnimatePresence initial={false}>
            <RenderCase renderIf={form == 0}>
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
                    label={intl.formatMessage({ id: "Login.Form1" })}
                    placeholder="example@gmail.com"
                    id="account"
                    type="text"
                    state={errorField && (!account || !emailRegex.test(account)) ? "error" : "none"}
                    value={account}
                    setValue={setAccount}
                    className="bg-white dark:!bg-[#3a3b3c]"
                  />
                  <InputField
                    variant={false}
                    label={intl.formatMessage({ id: "Login.Form5" })}
                    placeholder={intl.formatMessage({ id: "Login.Form3" })}
                    id="password"
                    type="password"
                    state={errorField && !password ? "error" : "none"}
                    value={password}
                    setValue={setPassword}
                    className="bg-white dark:!bg-[#3a3b3c]"
                  />
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center visible -ml-0.5">
                      <Checkbox onChange={setRememberMe} color="blue" checked={rememberMe} />
                      <label
                        htmlFor="remember-me"
                        className={`ml-2 text-sm font-medium ${rememberMe ? "text-blue-600 dark:text-white" : "text-black dark:text-white"}`}
                      >
                        <FormattedMessage id="Login.Save" />
                      </label>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-brand-600 dark:text-white visible"
                      onClick={loading ? () => { } : () => setCurrentForm(2)}>
                      <FormattedMessage id="Login.Forgot" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </RenderCase>
          </AnimatePresence>

          <AnimatePresence initial={false}>
            <RenderCase renderIf={form == 1}>
              <motion.div
                key="option1"
                className="w-full h-full"
                initial={{ scale: 0, height: "0" }}
                animate={{ scale: 1, height: "auto" }}
                exit={{ scale: 0, height: "0" }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full flex flex-col justify-center h-full gap-4 pb-8">
                  <InputField
                    variant={false}
                    label={intl.formatMessage({ id: "Login.Form6" })}
                    placeholder="Nguyen Van A"
                    id="name"
                    type="text"
                    value={name}
                    state={errorField && !name ? "error" : "none"}
                    setValue={setName}
                    className="bg-white dark:!bg-[#3a3b3c]"
                  />
                  <InputField
                    variant={false}
                    label={intl.formatMessage({ id: "Login.Form1" })}
                    placeholder="example@gmail.com"
                    id="account"
                    type="text"
                    value={account}
                    state={errorField && (!account || !emailRegex.test(account)) ? "error" : "none"}
                    setValue={setAccount}
                    className="bg-white dark:!bg-[#3a3b3c]"
                  />
                  <InputField
                    variant={false}
                    label={intl.formatMessage({ id: "Login.Form5" })}
                    placeholder={intl.formatMessage({ id: "Login.Form3" })}
                    id="password"
                    type="password"
                    state={errorField && !password ? "error" : "none"}
                    value={password}
                    setValue={setPassword}
                    className="bg-white dark:!bg-[#3a3b3c]"
                  />
                  <InputField
                    variant={false}
                    label={intl.formatMessage({ id: "Login.Form4" })}
                    placeholder={intl.formatMessage({ id: "Login.Form4" })}
                    id="password2"
                    type="password"
                    state={errorField && (!password2 || password2 != password) ? "error" : "none"}
                    value={password2}
                    setValue={setPassword2}
                    className="bg-white dark:!bg-[#3a3b3c]"
                  />
                </div>
              </motion.div>
            </RenderCase>
          </AnimatePresence>

          <AnimatePresence initial={false}>
            <RenderCase renderIf={form == 2}>
              <motion.div
                key="option2"
                className="w-full h-full"
                initial={{ scale: 0, height: "0" }}
                animate={{ scale: 1, height: "auto" }}
                exit={{ scale: 0, height: "0" }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full flex flex-col justify-center h-full gap-4 pb-8">
                  <InputField
                    variant={false}
                    label={intl.formatMessage({ id: "Login.Form2" })}
                    placeholder="example@gmail.com"
                    id="account"
                    type="text"
                    state={errorField && (!account || !emailRegex.test(account)) ? "error" : "none"}
                    value={account}
                    setValue={setAccount}
                    className="bg-white dark:!bg-[#3a3b3c]"
                  />
                </div>
              </motion.div>
            </RenderCase>
          </AnimatePresence>

          <button
            onClick={loading ? () => { } : submit}
            className="linear w-full rounded-xl bg-brand-500 -mt-4 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            <RenderCase renderIf={form == 0 && !loading}>
              <FormattedMessage id="Login.Login" />
            </RenderCase>

            <RenderCase renderIf={form == 1 && !loading}>
              <FormattedMessage id="Login.SignUp" />
            </RenderCase>

            <RenderCase renderIf={form == 2 && !loading}>
              <FormattedMessage id="Login.Forgot2" />
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
