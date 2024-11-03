import { IconType } from "react-icons";
import { FaMusic, FaFileAlt, FaCamera, FaCloud, FaGamepad, FaEnvelope, FaHeart, FaMap, FaShoppingCart, FaUser, FaGlobe, FaCogs } from "react-icons/fa";

interface AppData {
    id: number;
    name: string;
    icon: IconType;
    className: string;
}

export const apps: AppData[] = [
    { id: 1, name: "Music", icon: FaMusic, className: "lg:row-span-2 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-2 aspect-auto" },
    { id: 4, name: "Cloud", icon: FaCloud, className: "aspect-square" },
    { id: 2, name: "Camera", icon: FaCamera, className: "aspect-square" },
    { id: 3, name: "Documents", icon: FaFileAlt, className: "col-span-2 sm:col-span-1 md:col-span-2" },
    { id: 5, name: "Games", icon: FaGamepad, className: "aspect-square" },
    { id: 7, name: "Email", icon: FaEnvelope, className: "aspect-square" },
    { id: 8, name: "Health", icon: FaHeart, className: "aspect-square" },
    { id: 9, name: "Maps", icon: FaMap, className: "aspect-square" },
    { id: 10, name: "Shopping", icon: FaShoppingCart, className: "aspect-square" },
    { id: 11, name: "Profile", icon: FaUser, className: "aspect-square" },
    { id: 12, name: "Browser", icon: FaGlobe, className: "aspect-square" },
    { id: 6, name: "Settings", icon: FaCogs, className: "aspect-square" },
];