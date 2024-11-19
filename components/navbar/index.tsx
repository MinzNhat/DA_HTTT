"use client";
import { useBattery } from "react-use";
import routes from "@/data/routes";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useCurrentTime from "@/hooks/useCurrentTime";
import Progress from "../progress";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FormattedMessage, useIntl } from "react-intl";
import { useThemeContext } from "@/providers/ThemeProvider";
import { RiSunFill, RiMoonFill } from "react-icons/ri";
import RenderCase from "../rendercase";
import Image from "next/image";
import Dropdown from "@/components/dropdown";
import { useUserAuthContext } from "@/providers/AuthProvider";
import SubmitPopup from "../submit";
import { UserOperation } from "@/api_lib/User";
import NotiPopup from "../notification";
import { usePassDataContext, UserInfo } from "@/providers/PassedData";
import LanguageSwitcher from "../language";

interface Props {
  openApp: boolean;
}

const Navbar: FC<Props> = ({ openApp }) => {
  const [currentRoute, setCurrentRoute] = useState("Loading...");
  const intl = useIntl();
  const pathname = usePathname();
  const formattedTime = useCurrentTime();
  const battery = useBattery() as any;
  const { theme, setTheme } = useThemeContext();
  const { isSupported, level, charging, dischargingTime, chargingTime } =
    battery;
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openLogout, setOpenLogout] = useState<boolean>(false);
  const [message, setMessage] = useState<JSX.Element | string>("");
  const { loading, logout } = useUserAuthContext();
  const { passData, setPassData } = usePassDataContext();
  const userOperation = new UserOperation();

  const getActiveRoute = (routes: any) => {
    let activeRoute = "menu";
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        setCurrentRoute(routes[i].path);
      }
    }
    return activeRoute;
  };
  const checkUserLoggedIn = async () => {
    const token = localStorage?.getItem("accessToken");
    if (!token) {
      setMessage("Vui lòng đăng nhập để tiếp tục");
      setOpenLogout(true);
      return;
    }

    const response = await userOperation.getUserInfo({ token: token });
    if (response.error) {
      setMessage("Vui lòng đăng nhập để tiếp tục");
      setOpenLogout(true);
      return;
    } else {
      setPassData(response.data);
    }
  };

  const divVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      y: direction == 0 ? 0 : direction > 0 ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const handleLogoutClick = () => {
    setMessage("Xác nhận thoát phiên đăng nhập?");
    setOpenNotification(true);
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  return (
    <motion.nav
      variants={divVariants}
      initial="hidden"
      animate="visible"
      custom={-1}
      className={`z-[45] p-2 transition-all duration-500`}
    >
      <RenderCase renderIf={openNotification}>
        <SubmitPopup
          message={message}
          submit={logout}
          onClose={() => setOpenNotification(false)}
        />
      </RenderCase>
      <RenderCase renderIf={openLogout}>
        <NotiPopup message={message} onClose={logout} />
      </RenderCase>
      <div
        className={` h-7 ${
          openApp
            ? "bg-white dark:bg-[#242526] shadow-[4px_-4px_10px_rgba(0,0,0,0.3)]"
            : "backdrop-blur-xl bg-white/80 dark:bg-[#242526]/50"
        } flex gap-4 justify-between transition-all duration-200 px-2 py-1 rounded-md`}
      >
        <div className="w-1/3">
          <Dropdown
            button={
              <div
                className={`text-sm font-semibold text-blue-700 hover:text-brand-600 dark:text-white visible flex place-items-center`}
                onClick={() => {}}
              >
                <Image
                  src="/logo.ico"
                  alt="Your image"
                  width={20}
                  height={20}
                />
              </div>
            }
          >
            <div className="absolute -left-2 flex w-44 !z-50 flex-col justify-start border dark:border-white/10 rounded-md bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-[#242526] dark:text-white dark:shadow-none">
              <div className="flex flex-col py-1 px-2">
                <button className="text-sm font-medium text-blue-700 dark:text-white text-left gap-2 flex place-items-center">
                  Nền: {theme == "dark" ? "Tối" : "Sáng"} <div>{"->"}</div>
                  <div
                    className="cursor-pointer text-gray-600 mb-0.25"
                    onClick={() => {
                      theme === "dark" ? setTheme("light") : setTheme("dark");
                    }}
                  >
                    {theme === "dark" ? (
                      <RiSunFill className="w-4 h-4 text-blue-700 dark:text-white" />
                    ) : (
                      <RiMoonFill className="w-4 h-4 text-blue-700 dark:text-white" />
                    )}
                  </div>
                </button>
              </div>
              <div className="h-[0.5px] w-full bg-gray-200 dark:bg-white/10 " />
              <div className="flex flex-col py-1 px-2">
                <button className="text-sm font-medium text-blue-700 dark:text-white text-left">
                  Tình trạng pin:{" "}
                  {charging == true
                    ? "Đang sạc"
                    : charging == false
                    ? "Không cắm sạc"
                    : "Không hỗ trỡ"}
                </button>
              </div>
              <div className="h-[0.5px] w-full bg-gray-200 dark:bg-white/10 " />

              <div className="py-1 px-2 flex flex-col">
                <button
                  onClick={handleLogoutClick}
                  className="text-sm font-medium text-red-500 hover:text-red-500 text-left"
                >
                  <FormattedMessage id="Navbar.Logout" />
                </button>
              </div>
            </div>
          </Dropdown>
        </div>

        <RenderCase renderIf={pathname == "/menu"}>
          <div
            className={`text-md font-semibold text-blue-700 dark:text-white place-items-center w-1/3 justify-center hidden sm:flex`}
          >
            {intl.formatMessage({ id: `routes.menu` })}
          </div>
        </RenderCase>

        <div className="text-sm font-semibold text-blue-700 dark:text-white w-1/3 flex sm:hidden justify-center place-items-center">
          {formattedTime ?? "00:00:00"}
        </div>

        <div className={`flex place-items-center justify-end gap-2 w-1/3`}>
          <LanguageSwitcher />
          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              theme === "dark" ? setTheme("light") : setTheme("dark");
            }}
          >
            {theme === "dark" ? (
              <RiSunFill className="w-4 h-4 text-blue-700 dark:text-white" />
            ) : (
              <RiMoonFill className="w-4 h-4 text-blue-700 dark:text-white" />
            )}
          </div>
          <div className="text-blue-700 dark:text-white font-semibold text-xs hidden sm:block">
            {level && typeof level == "number" ? level * 100 : 40}%
          </div>
          <div className="w-8 sm:w-10 flex justify-center place-items-center relative">
            <Progress
              value={
                level && typeof level == "number"
                  ? (level * 100).toFixed(2)
                  : 40
              }
              color="blue"
            />
            <div className="absolute text-white hidden sm:block">
              <BsFillLightningChargeFill />
            </div>
            <div className="absolute text-blue-700 dark:text-white font-semibold text-xs sm:hidden">
              {level && typeof level == "number" ? level * 100 : 40}
            </div>
          </div>
          <div className="text-sm font-semibold text-blue-700 dark:text-white hidden sm:block">
            {formattedTime ?? "00:00:00"}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
