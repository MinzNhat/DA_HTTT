import { IconType } from "react-icons";
import { FaMusic, FaFileAlt, FaCamera, FaCloud, FaGamepad, FaEnvelope, FaHeart, FaMap, FaShoppingCart, FaUser, FaGlobe, FaCogs } from "react-icons/fa";

interface AppData {
    id: number;
    name: string;
    icon: IconType;
    className: string;
    link: string;
}

export const apps: AppData[] = [
    { id: 1, name: "Music", icon: FaMusic, className: "lg:row-span-2 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-2 aspect-auto", link: "/products" },
    { id: 4, name: "Sales Order", icon: FaCloud, className: "aspect-square", link: "/salesorder" },
    { id: 2, name: "Special Offer", icon: FaCamera, className: "aspect-square", link: "/specialoffer" },
    { id: 3, name: "Territory", icon: FaFileAlt, className: "col-span-2 sm:col-span-1 md:col-span-2", link: "/territory" },
    { id: 5, name: "User", icon: FaGamepad, className: "aspect-square", link: "/user" },
    { id: 7, name: "Products", icon: FaEnvelope, className: "aspect-square", link: "/products" },
    { id: 8, name: "Health", icon: FaHeart, className: "aspect-square", link: "" },
    { id: 9, name: "Maps", icon: FaMap, className: "aspect-square", link: "" },
    { id: 10, name: "Shopping", icon: FaShoppingCart, className: "aspect-square", link: "" },
    { id: 11, name: "Profile", icon: FaUser, className: "aspect-square", link: "" },
    { id: 12, name: "Browser", icon: FaGlobe, className: "aspect-square", link: "" },
    { id: 6, name: "Settings", icon: FaCogs, className: "aspect-square", link: "/settings" },
];