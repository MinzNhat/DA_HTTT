"use client";
import { useBattery } from 'react-use';
import routes from "@/data/routes";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { motion } from 'framer-motion';
import useCurrentTime from '@/hooks/useCurrentTime';
import Progress from '../progress';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import { useIntl } from 'react-intl';
import { useThemeContext } from '@/providers/ThemeProvider';
import { RiSunFill, RiMoonFill } from 'react-icons/ri';
import RenderCase from '../rendercase';
import Image from "next/image";

interface Props {
  openApp: boolean,
}

const Navbar: FC<Props> = ({ openApp }) => {
  const [currentRoute, setCurrentRoute] = useState("Loading...");
  const intl = useIntl()
  const route = useRouter();
  const pathname = usePathname();
  const formattedTime = useCurrentTime();
  const battery = useBattery() as any;
  const { theme, setTheme } = useThemeContext();
  const { isSupported, level, charging, dischargingTime, chargingTime } = battery;

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
    // const getinfo = new StaffOperation()
    // const response = await getinfo.getAuthenticatedStaffInfo();
    // if (!!response.error || response.error?.error || response.error == undefined) console.log(response)
    // else if (!!response.data) {
    //   setPassData(response.data);
    //   setDataUpdate(response.data);
    //   setUsername(response.data.account.username);
    //   const response2 = await getinfo.getAvatar({ staffId: response.data.staffId })
    //   setProfilePicture(response2 && Buffer.byteLength(response2) > 0 ? `${imgURL}${response.data.staffId}` : "/avatar.jpg")
    // }

    // if ((!!response.error) || (response.error == undefined)) {
    //   setMessage(intl.formatMessage({ id: "Navbar.Message" }))
    //   openModal(true)
    // }
  }

  const divVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      y: direction == 0 ? 0 : direction > 0 ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  return (
    <>
      <motion.nav
        variants={divVariants}
        initial="hidden"
        animate="visible"
        custom={-1}
        className={`z-[45] p-2 transition-all duration-500`}>
        <div className={` h-7 ${openApp ? "bg-white dark:bg-[#242526] shadow-[4px_-4px_10px_rgba(0,0,0,0.3)]" : "backdrop-blur-xl bg-white/10 dark:bg-[#242526]/50"} flex gap-4 justify-between transition-all duration-200 px-2 py-1 rounded-md`}>

          <button className={`w-1/3 text-sm font-semibold text-navy-700 hover:text-brand-600 dark:text-white visible flex place-items-center`}
            onClick={() => { }}>
            <Image src="/logo.ico" alt="Your image" width={20} height={20} />
          </button>
          <RenderCase renderIf={currentRoute == "menu"}>
            <div className={`text-md font-semibold text-navy-700 dark:text-white place-items-center w-1/3 justify-center hidden sm:flex`}>
              {intl.formatMessage({ id: `routes.menu` })}
            </div>
          </RenderCase>

          <div className="text-sm font-semibold text-navy-700 dark:text-white w-1/3 flex sm:hidden justify-center place-items-center">
            {formattedTime ?? "00:00:00"}
          </div>

          <div className={`flex place-items-center  justify-end gap-2 w-1/3`}>
            <div
              className="cursor-pointer text-gray-600 hidden sm:block"
              onClick={() => {
                theme === "dark" ? setTheme("light") : setTheme("dark");
              }}
            >
              {theme === "dark" ? (
                <RiSunFill className="w-4 h-4 text-navy-700 dark:text-white" />
              ) : (
                <RiMoonFill className="w-4 h-4 text-navy-700 dark:text-white" />
              )}
            </div>
            <div className="text-navy-700 dark:text-white font-semibold text-xs">
              {level && typeof level == "number" ? level * 100 : 40}%
            </div>
            <div className="w-6 sm:w-10 flex justify-center place-items-center relative">
              <Progress value={level && typeof level == "number" ? (level * 100).toFixed(2) : 40} color="navy" />
              <div className="absolute text-white"><BsFillLightningChargeFill /></div>
            </div>
            <div className="text-sm font-semibold text-navy-700 dark:text-white hidden sm:block">
              {formattedTime ?? "00:00:00"}
            </div>
          </div>
        </div>
      </motion.nav>
    </>

  );
};

export default Navbar;