'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@nextui-org/react';
import { IoShareOutline } from "react-icons/io5";
import { usePassDataContext, UserInfo } from '@/providers/PassedData';
import { IoIosAdd, IoIosBrowsers } from 'react-icons/io';
import { FaAngleLeft, FaAngleRight, FaUser } from 'react-icons/fa';
import RenderCase from '@/components/rendercase';
import SettingAccount from './SettingAccount';
import { useIntl } from 'react-intl';
import { useThemeContext } from '@/providers/ThemeProvider';
import NotiPopup from '@/components/notification';
import SubmitPopup from '@/components/submit';
import { UpdateUserInfo, UserOperation } from '@/api_lib/User';

const SettingsMain = () => {
    const intl = useIntl()
    const { theme } = useThemeContext()
    const [option, setOption] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const { passData, setPassData } = usePassDataContext();
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [openSubmitNotification, setOpenSubmitNotification] = useState<boolean>(false);
    const phoneNumberRegex = /^[0-9]{10,11}$/;
    const userOperation = new UserOperation()
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
    })

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
    };

    const handleChange = (id: keyof UserInfo, value: string | number) => {
        setData(prev => ({ ...prev, [id]: value }));
    };

    const handleNumberChange = (id: keyof UserInfo, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        setData(prev => ({ ...prev, [id]: numericValue }));
    };

    const submit = () => {
        const hasChanges = () => {
            return Object.keys(data).some((key) => data[key as keyof UserInfo] !== passData[key as keyof UserInfo]);
        };

        if (!hasChanges()) {
            setMessage("Vui lòng chỉnh sửa thông tin muốn cập nhật");
            setOpenNotification(true);
            return;
        } else if ((data.PhoneNumber != passData.PhoneNumber) && !(phoneNumberRegex.test(data.PhoneNumber))) {
            setMessage("Vui lòng nhập đúng định dạng số điện thoại")
            setOpenNotification(true)
            return
        } else {
            setMessage("Xác nhận cập nhật thông tin?")
            setOpenSubmitNotification(true)
        }
    }

    const updateData = async () => {
        const { name, PhoneNumber, AddressLine1, AddressLine2, CountryRegionName, City, JobTitle } = data
        const updateData: UpdateUserInfo = {
            name, PhoneNumber, AddressLine1, AddressLine2, CountryRegionName, City, JobTitle
        }

        const token = localStorage?.getItem('accessToken');
        if (!token) {
            setMessage("Vui lòng đăng nhập để tiếp tục")
            setOpenNotification(true)
            return
        }

        const response = await userOperation.updateUserInfo({ token: token }, updateData)

        setOpenSubmitNotification(false)
        if (response.error) {
            setMessage("Đã có lỗi xảy ra, vui lòng thử lại sau")
            setOpenNotification(true)
        } else {
            setMessage("Cập nhật thông tin cá nhân thành công")
            setPassData(data)
            setOpenNotification(true)
        }
    }

    const fields: Array<{ id: keyof UserInfo, type: string, label: string, disable?: boolean, important?: boolean, onChange?: (id: keyof UserInfo, value: string) => void, }> = [
        { id: "name", type: "text", label: "Settings.Fullname", important: false },
        { id: "PhoneNumber", type: "text", label: "Settings.PhoneNumber", important: false, onChange: handleNumberChange },
        { id: "email", type: "text", label: "Settings.Email", disable: true, important: true },
        { id: "AddressLine1", type: "text", label: "Settings.AddressLine1", important: false },
        { id: "AddressLine2", type: "text", label: "Settings.AddressLine2", important: false },
        { id: "City", type: "text", label: "Settings.City", important: false },
        { id: "CountryRegionName", type: "text", label: "Settings.CountryRegionName", important: false },
        { id: "JobTitle", type: "text", label: "Settings.JobTitle", important: false },
        { id: "isManager", type: "text", label: "Settings.isManager", disable: true, important: true },
    ];

    useEffect(() => {
        if (passData) {
            setData(passData)
        }
    }, [passData]);

    return (
        <div className="flex justify-between place-items-center dark:text-white relative flex-col h-full">
            <RenderCase renderIf={openNotification}>
                <NotiPopup message={message} onClose={() => setOpenNotification(false)} />
            </RenderCase>

            <RenderCase renderIf={openSubmitNotification}>
                <SubmitPopup message={message} onClose={() => { setOpenSubmitNotification(false); }} submit={updateData} />
            </RenderCase>
            <div className="sticky top-0 w-full flex gap-2 z-10 bg-white dark:bg-[#242526] h-12 min-h-12 px-2 justify-center place-items-center">
                <div className='gap-3 px-1 hidden sm:flex'>
                    <FaAngleLeft className='w-6 h-6' />
                    <FaAngleRight className='w-6 h-6' />
                </div>

                <div className='dark:bg-[#3A3B3C] bg-lightPrimary rounded-md sm:rounded-full flex w-full overflow-clip relative'>
                    <Button className={`w-full flex flex-row h-9 ${option === 0 ? "text-blue-500 font-semibold " : "text-black font-sans"}`} onClick={() => setOption(0)}>
                        <span className="text-sm sm:md">Tài khoản</span>
                    </Button>
                    <Button className={`w-full flex flex-row h-9 ${option === 1 ? "text-blue-500 font-semibold " : "text-black font-sans"}`} onClick={() => setOption(1)}>
                        <span className="text-sm sm:md">Nền hệ thống</span>
                    </Button>
                    <Button className={`w-full flex flex-row h-9 ${option === 2 ? "text-blue-500 font-semibold " : "text-black font-sans"}`} onClick={() => setOption(2)}>
                        <span className="text-sm sm:md">Ngôn ngữ</span>
                    </Button>
                    <motion.div
                        className={`w-1/3 bg-blue-500 -bottom-[1px] h-[2px] absolute`}
                        initial={{ width: 0 }}
                        animate={{ width: "33.33%" }}
                        exit={{ width: 0 }}
                        transition={{ duration: 0.3 }}
                        variants={{
                            left: { width: "33.33%", left: 0, right: "auto" },
                            center: { width: "33.33%", left: "33.33%", right: "auto" },
                            right: { width: "33.33%", left: "66.66%", right: "auto" },
                        }}
                        //@ts-ignore
                        initial="left"
                        animate={option === 0 ? "left" : option === 1 ? "center" : "right"}
                        exit="left"
                    />
                </div>

                <div className='gap-2 px-1 hidden sm:flex'>
                    <IoShareOutline className='w-5 h-5' />
                    <IoIosAdd className='w-6 h-6' />
                    <IoIosBrowsers className='w-5 h-5' />
                </div>
            </div>

            <div className="w-full relative overflow-y-auto no-scrollbar flex flex-col gap-4">
                <RenderCase renderIf={option === 0}>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className='flex justify-center w-full mt-6'
                    >
                        <RenderCase renderIf={theme === "dark"}>
                            <img
                                src='/avatar.jpg'
                                alt="avatar"
                                width={19200}
                                height={10800}
                                className="h-40 w-40 object-cover rounded-full"
                            />
                        </RenderCase>
                        <RenderCase renderIf={theme === "light"}>
                            <div className="h-40 w-40 rounded-full bg-white flex justify-center place-items-center" >
                                <FaUser className="text-blue-700 h-20 w-20" />
                            </div>
                        </RenderCase>
                    </motion.div>
                </RenderCase>

                <RenderCase renderIf={option === 0}>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className='p-4 flex flex-col gap-4 w-full'
                    >
                        <SettingAccount data={data} fields={fields} handleChange={handleChange} setData={setData} intl={intl} />
                    </motion.div>
                </RenderCase>
            </div>

            <RenderCase renderIf={option === 0}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='w-full px-2 pb-2'
                >
                    <button
                        onClick={submit}
                        className="linear w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    >
                        Cập nhật
                    </button>
                </motion.div>
            </RenderCase>
        </div>
    );
};

export default SettingsMain;
