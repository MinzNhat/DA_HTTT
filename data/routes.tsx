import { FaFileInvoice, FaGift, FaMapSigns, FaPlusCircle, FaUsers } from "react-icons/fa";
import { FaChartColumn } from "react-icons/fa6";
import {
  MdOutlineProductionQuantityLimits,
  MdOutlineSettingsSuggest,
} from "react-icons/md";
const routes = [
  {
    name: "Trang chủ",
    path: "menu",
    icon: <FaPlusCircle className="h-4 w-4" />,
  },
  {
    name: "Cài đặt hệ thống",
    path: "settings",
    icon: <MdOutlineSettingsSuggest className="h-5 w-5" />,
  },
  {
    name: "Sản phẩm",
    path: "products",
    icon: <MdOutlineProductionQuantityLimits className="h-5 w-5" />,
  },
  {
    name: "Đơn bán hàng",
    path: "saleorders",
    icon: <MdOutlineProductionQuantityLimits className="h-5 w-5" />,
  },
  {
    name: "Ưu đãi đặc biệt",
    path: "specialoffer",
    icon: <FaGift className="h-5 w-5" />,
  },
  {
    name: "Lãnh thổ",
    path: "territory",
    icon: <FaMapSigns className="h-4 w-4" />,
  },
  {
    name: "Người dùng",
    path: "user",
    icon: <FaUsers className="h-4 w-4" />,
  },
  {
    name: "...",
    path: "salesorder",
    icon: <FaFileInvoice className="h-4 w-4" />,
  },
  {
    name: "...",
    path: "statistics",
    icon: <FaChartColumn className="h-4 w-4" />,
  },
];

export default routes;
