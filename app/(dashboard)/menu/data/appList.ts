import { IconType } from "react-icons";
import { FaMusic, FaFileInvoice, FaGift, FaMapMarkedAlt, FaUsers, FaClipboardList, FaHeartbeat, FaMapSigns, FaShoppingBag, FaUserCircle, FaChrome, FaCog } from "react-icons/fa";
import { FaChartColumn } from "react-icons/fa6";

interface AppData {
    id: number;
    name: string;
    icon: IconType;
    className: string;
    link: string;
}

export const apps: AppData[] = [
    { id: 1, name: "Music", icon: FaMusic, className: "lg:row-span-2 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-2 aspect-auto", link: "/products" },
    { id: 2, name: "Statistics", icon: FaChartColumn, className: "aspect-square", link: "/statistics" },
    { id: 3, name: "Sales Order", icon: FaFileInvoice, className: "aspect-square", link: "/salesorder" },
    { id: 4, name: "Territory", icon: FaMapSigns, className: "col-span-2 sm:col-span-1 md:col-span-2", link: "/territory" },
    { id: 5, name: "Special Offer", icon: FaGift, className: "aspect-square", link: "/specialoffer" },
    { id: 6, name: "User", icon: FaUsers, className: "aspect-square", link: "/user" },
    { id: 7, name: "Products", icon: FaClipboardList, className: "aspect-square", link: "/products" },
    { id: 8, name: "Settings", icon: FaCog, className: "aspect-square", link: "/settings" },
    { id: 9, name: "Analysis", icon: FaCog, className: "aspect-square", link: "/analysis" },
];