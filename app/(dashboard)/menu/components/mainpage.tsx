'use client';
import { useOpenAppDataContext } from "@/providers/OpenAppProvider";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { IconType } from "react-icons";
import { FaMusic, FaCamera, FaFileAlt, FaCloud, FaGamepad, FaCogs, FaEnvelope, FaHeart, FaMap, FaShoppingCart, FaUser, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion"; // Import framer-motion

// Tạo dữ liệu mẫu cho các ứng dụng
interface AppData {
    id: number;
    name: string;
    icon: IconType;
}

const apps: AppData[] = [
    { id: 1, name: "Music", icon: FaMusic },
    { id: 2, name: "Camera", icon: FaCamera },
    { id: 3, name: "Documents", icon: FaFileAlt },
    { id: 4, name: "Cloud", icon: FaCloud },
    { id: 5, name: "Games", icon: FaGamepad },
    { id: 6, name: "Settings", icon: FaCogs },
    { id: 7, name: "Email", icon: FaEnvelope },
    { id: 8, name: "Health", icon: FaHeart },
    { id: 9, name: "Maps", icon: FaMap },
    { id: 10, name: "Shopping", icon: FaShoppingCart },
    { id: 11, name: "Profile", icon: FaUser },
    { id: 12, name: "Browser", icon: FaGlobe }
];

const MenuList: FC = () => {
    const router = useRouter();
    const { setOpenApp } = useOpenAppDataContext();

    return (
        <div className="w-full h-fit grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {apps.map((app, index) => (
                <motion.div
                    key={app.id}
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, translateY: 50 }} // Bắt đầu từ dưới
                    animate={{ opacity: 1, translateY: 0 }}  // Chuyển lên vị trí ban đầu
                    transition={{ duration: 0.4, delay: index * 0.1 }} // Thời gian xuất hiện và delay theo index
                >
                    <div
                        className="flex flex-col items-center justify-center w-full aspect-square backdrop-blur-xl bg-white/30 dark:bg-[#242526]/50 rounded-lg shadow-lg cursor-pointer"
                        onClick={() => { setOpenApp({ openApp: true, appName: "testApp" }) }} // Thay đổi appName dựa trên tên app
                    >
                        <app.icon className="text-4xl lg:text-6xl mb-2 dark:text-white text-navy-700 h-full pt-10" />
                        <span className="text-md font-semibold mb-2 dark:text-white text-navy-700 justify-self-end h-10">{app.name}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default MenuList;
