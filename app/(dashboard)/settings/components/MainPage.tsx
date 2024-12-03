"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import { IoShareOutline } from "react-icons/io5";
import { usePassDataContext, UserInfo } from "@/providers/PassedData";
import { IoIosAdd, IoIosBrowsers } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import RenderCase from "@/components/rendercase";
import SettingAccount from "./SettingAccount";
import { FormattedMessage, useIntl } from "react-intl";
import { useThemeContext } from "@/providers/ThemeProvider";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { UpdateUserInfo, UserOperation } from "@/api_lib/User";
import SettingTheme from "./SettingTheme";
import LanguageSwitcher from "@/components/language";

const SettingsMain = () => {
  const intl = useIntl();
  const { theme } = useThemeContext();
  const [[page, direction], setPage] = useState([0, 0]);
  const [message, setMessage] = useState<string>("");
  const { passData, setPassData } = usePassDataContext();
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openSubmitNotification, setOpenSubmitNotification] =
    useState<boolean>(false);
  const phoneNumberRegex = /^[0-9]{10,11}$/;
  const userOperation = new UserOperation();
  const [data, setData] = useState<UserInfo>({
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    CountryRegionName: "",
    JobTitle: "",
    PhoneNumber: "",
    email: "",
    isManager: false,
    name: "",
  });

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
      };
    },
  };

  const paginate = useCallback(
    (targetPage: number) => {
      setPage([targetPage, targetPage - page]);
    },
    [page]
  );

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleChange = (id: keyof UserInfo, value: string | number) => {
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberChange = (id: keyof UserInfo, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setData((prev) => ({ ...prev, [id]: numericValue }));
  };

  const submit = () => {
    const hasChanges = () => {
      return Object.keys(data).some(
        (key) => data[key as keyof UserInfo] !== passData[key as keyof UserInfo]
      );
    };

    if (!hasChanges()) {
      setMessage(intl.formatMessage({ id: "Settings.message1" }));
      setOpenNotification(true);
      return;
    } else if (
      data.PhoneNumber != passData.PhoneNumber &&
      !phoneNumberRegex.test(data.PhoneNumber)
    ) {
      setMessage(intl.formatMessage({ id: "Settings.message2" }));
      setOpenNotification(true);
      return;
    } else {
      setMessage(intl.formatMessage({ id: "Settings.message3" }));
      setOpenSubmitNotification(true);
    }
  };

  const updateData = async () => {
    const {
      name,
      PhoneNumber,
      AddressLine1,
      AddressLine2,
      CountryRegionName,
      City,
      JobTitle,
    } = data;
    const updateData: UpdateUserInfo = {
      name,
      PhoneNumber,
      AddressLine1,
      AddressLine2,
      CountryRegionName,
      City,
      JobTitle,
    };

    const token = localStorage?.getItem("accessToken");

    const response = await userOperation.updateUserInfo(
      { token: token },
      updateData
    );

    setOpenSubmitNotification(false);
    if (response.error) {
      setMessage(intl.formatMessage({ id: "Settings.message4" }));
      setOpenNotification(true);
    } else {
      setMessage(intl.formatMessage({ id: "Settings.message5" }));
      setPassData(data);
      setOpenNotification(true);
    }
  };

  const fields: Array<{
    id: keyof UserInfo;
    type: string;
    label: string;
    disable?: boolean;
    important?: boolean;
    onChange?: (id: keyof UserInfo, value: string) => void;
  }> = [
      { id: "name", type: "text", label: "Settings.Fullname", important: false },
      {
        id: "PhoneNumber",
        type: "text",
        label: "Settings.PhoneNumber",
        important: false,
        onChange: handleNumberChange,
      },
      {
        id: "email",
        type: "text",
        label: "Settings.Email",
        disable: true,
        important: true,
      },
      {
        id: "AddressLine1",
        type: "text",
        label: "Settings.AddressLine1",
        important: false,
      },
      {
        id: "AddressLine2",
        type: "text",
        label: "Settings.AddressLine2",
        important: false,
      },
      { id: "City", type: "text", label: "Settings.City", important: false },
      {
        id: "CountryRegionName",
        type: "text",
        label: "Settings.CountryRegionName",
        important: false,
      },
      {
        id: "JobTitle",
        type: "text",
        label: "Settings.JobTitle",
        important: false,
      },
      {
        id: "isManager",
        type: "text",
        label: "Settings.isManager",
        disable: true,
        important: true,
      },
    ];

  const options = [
    {
      id: 0,
      component: (
        <div className="flex flex-col gap-4 w-full h-full md:w-1/2">
          <SettingAccount
            theme={theme}
            data={data}
            fields={fields}
            handleChange={handleChange}
            setData={setData}
            intl={intl}
          />
        </div>
      ),
    },
    {
      id: 1,
      component: (
        <div className="flex flex-col gap-4 w-full h-full">
          <SettingTheme />
        </div>
      ),
    },
    {
      id: 2, component: (
        <div className="flex flex-col gap-4 w-full h-full place-items-center justify-center">
          <LanguageSwitcher version="2" />
        </div>
      )
    },
  ];

  const swipeConfidenceThreshold = 2;

  useEffect(() => {
    if (passData) {
      setData(passData);
    }
  }, [passData]);

  return (
    <div className="flex place-items-center dark:text-white relative flex-col h-full">
      <RenderCase renderIf={openNotification}>
        <NotiPopup
          message={message}
          onClose={() => setOpenNotification(false)}
        />
      </RenderCase>

      <RenderCase renderIf={openSubmitNotification}>
        <SubmitPopup
          message={message}
          onClose={() => {
            setOpenSubmitNotification(false);
          }}
          submit={updateData}
        />
      </RenderCase>
      <div className="sticky top-0 w-full flex gap-2 z-10 bg-white dark:bg-[#242526] h-12 min-h-12 px-2 justify-center place-items-center">
        <div className="gap-3 px-1 hidden sm:flex">
          <FaAngleLeft className="w-6 h-6" />
          <FaAngleRight className="w-6 h-6" />
        </div>

        <div className="dark:bg-[#3A3B3C] bg-lightPrimary rounded-md sm:rounded-full flex w-full overflow-clip relative">
          <Button
            className={`w-full flex flex-row h-9 bg-lightPrimary dark:bg-darkContainerPrimary rounded-none ${page === 0
              ? "text-blue-500 font-semibold "
              : "text-black dark:text-white font-sans"
              }`}
            onClick={() => paginate(0)}
          >
            <span className="text-sm sm:md"><FormattedMessage id="Settings.button2" /></span>
          </Button>
          <Button
            className={`w-full flex flex-row h-9 bg-lightPrimary dark:bg-darkContainerPrimary rounded-none ${page === 1
              ? "text-blue-500 font-semibold "
              : "text-black dark:text-white font-sans"
              }`}
            onClick={() => paginate(1)}
          >
            <span className="text-sm sm:md"><FormattedMessage id="Settings.button3" /></span>
          </Button>
          <Button
            className={`w-full flex flex-row h-9 bg-lightPrimary dark:bg-darkContainerPrimary rounded-none ${page === 2
              ? "text-blue-500 font-semibold "
              : "text-black dark:text-white font-sans"
              }`}
            onClick={() => paginate(2)}
          >
            <span className="text-sm sm:md"><FormattedMessage id="Settings.button4" /></span>
          </Button>
          <motion.div
            className={`w-1/3 bg-blue-500 -bottom-[1px] h-[2px] absolute`}
            transition={{ duration: 0.3 }}
            variants={{
              left: { width: "33.33%", left: 0, right: "auto" },
              center: { width: "33.33%", left: "33.33%", right: "auto" },
              right: { width: "33.33%", left: "66.66%", right: "auto" },
            }}
            initial="left"
            animate={page === 0 ? "left" : page === 1 ? "center" : "right"}
            exit="left"
          />
        </div>

        <div className="gap-2 px-1 hidden sm:flex">
          <IoShareOutline className="w-5 h-5" />
          <IoIosAdd className="w-6 h-6" />
          <IoIosBrowsers className="w-5 h-5" />
        </div>
      </div>

      <div className="w-full relative overflow-y-auto no-scrollbar flex flex-col gap-4 h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {options.map(
            (indexoption) =>
              indexoption.id === page && (
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    opacity: { duration: 0.3 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(Math.min(page + 1, options.length - 1));
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(Math.max(page - 1, 0));
                    }
                  }}
                  className="inset-0 p-4 w-full h-full overflow-y-auto no-scrollbar flex justify-center mb-2"
                >
                  {indexoption.component}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      <RenderCase renderIf={page === 0}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full px-2 pb-2"
        >
          <button
            onClick={submit}
            className="linear w-full !rounded-md bg-brand-500 py-[10px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            <FormattedMessage id="Settings.button" />
          </button>
        </motion.div>
      </RenderCase>
    </div>
  );
};

export default SettingsMain;
