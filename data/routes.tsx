import { FaPlusCircle } from "react-icons/fa";
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
];

export default routes;
