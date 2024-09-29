'use client'

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import useMobileView from "@/hooks/useMobileView";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { useSearchParams } from "next/navigation";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import { useEffect, useState } from "react";
import InputField from "@/components/fields";
import Checkbox from "@/components/checkbox";
import { useBattery } from 'react-use';
import BatteryGauge from "react-battery-gauge";
import Progress from "@/components/progress";
import { BsFillLightningChargeFill } from "react-icons/bs";
import useCurrentTime from "@/hooks/useCurrentTime";

type LanguageMessages = {
  [key: string]: any;
}

export default function Home() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const languages: LanguageMessages = {
    vi: require('@/language/vi.json'),
    en: require('@/language/en.json')
  };
  const searchParams = useSearchParams();
  const locale = searchParams.get('locale') || 'vi';
  const defaultLocale = 'vi';
  const messages = languages[locale];
  const { isMobile } = useMobileView()
  const battery = useBattery() as any;
  const formattedTime = useCurrentTime();
  const { isSupported, level, charging, dischargingTime, chargingTime } =
    battery;

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
      <section className="flex h-dvh w-full relative justify-center place-items-center flex-col gap-4">

        <div className="h-12 w-11/12 md:w-2/3 lg:w-7/12 z-[45] flex 
      gap-4 rounded-xl bg-white/50 p-2 backdrop-blur-xl dark:bg-[#0b14374d] px-6 justify-between">

          <button
            className={`text-sm font-semibold text-blue-600 hover:text-brand-600 dark:text-white visible`}
          // onClick={() => setForm("forgotPw")}
          >
            Đăng ký tài khoản
          </button>

          <div className="text-md font-semibold text-blue-600 dark:text-white flex justify-center place-items-center">
            {formattedTime || "00:00:00"}
          </div>

          <div className="flex justify-center place-items-center">
            <div className="w-10 flex justify-center place-items-center relative">
              <Progress value={level && typeof level == "number" ? level * 100 : 40} color="blue" />
              <div className="absolute text-white"><BsFillLightningChargeFill /></div>
            </div>
            <div className="pl-2 text-blue-600 font-semibold">{level && typeof level == "number" ? level * 100 : 40}%</div>
          </div>

        </div>

        <div className="w-11/12 md:w-2/3 lg:w-7/12 h-5/6 md:h-2/3 z-[45] flex 
      gap-4 rounded-xl bg-white/50 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
          <div className="w-full h-full flex flex-col justify-start p-4 gap-4">
            <div className="flex flex-col gap-2 pr-24 lg:pr-40">
              <h4 className="text-4xl md:text-5xl font-bold text-navy-700 dark:text-white flex justify-between whitespace-nowrap">
                <FormattedMessage id="Login.Login" />
              </h4>
              <p className="pl-1 text-lg text-[#030391]">
                <FormattedMessage id="Login.Login2" />
              </p>
            </div>

            <div className="w-full flex flex-col justify-center h-full gap-4">
              <InputField
                variant="auth"
                label="Tên tài khoản"
                placeholder="example@gmail.com"
                id="account"
                type="text"
                value={account}
                setValue={setAccount}
                className="bg-white dark:!bg-[#3a3b3c]"
              />
              <InputField
                variant="auth"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                id="password"
                type="password"
                value={password}
                setValue={setPassword}
                className="bg-white dark:!bg-[#3a3b3c]"
              />
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex items-center visible -ml-0.5`}
                >
                  <Checkbox onChange={setCheck} color="blue" checked={check} />
                  <label
                    htmlFor="remember-me"
                    className={`ml-2 text-sm font-medium ${check ? "text-blue-600" : "text-black"}`}
                  >
                    Lưu đăng nhập
                  </label>
                </div>
                <button
                  className={`text-sm font-medium text-blue-600 hover:text-brand-600 dark:text-white visible`}
                // onClick={() => setForm("forgotPw")}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            <button
              onClick={() => { }}
              className="linear w-full rounded-xl bg-brand-500 -mt-4 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700  dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Đăng nhập
            </button>

          </div>

          <div className="ribbon z-20 absolute bg-white transition-all shadow-3xl duration-1000 -top-2 right-4 -scale-x-100">
            <div className="w-16 lg:w-[108px] h-28 lg:h-[108px] flex place-items-center transition-all duration-1000 -scale-x-100">
              <Image src="/logo.ico" alt="Your image" width={250} height={250} />
            </div>
          </div>
        </div>

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
        {/* <Sidebar />
        Navbar & Main Content
        <div className="h-full w-full bg-lightPrimary dark:!bg-[#3a3b3c]">
          <main className="mx-[12px] h-full flex-none transition-all md:pr-2 ${!isMobile && openSidebar ? "xl:ml-[313px]" : "xl:ml-5"}">
            <div className="h-full">
              <Navbar />
              <div className="pt-5s mx-auto mb-auto h-full min-h-[calc(100dvh-120px)] md:min-h-[calc(100dvh-89.5px)] p-2 md:pr-2">
              </div>
            </div>
          </main>
        </div> */}
      </section>

    </IntlProvider>
  );
}
