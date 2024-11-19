import { Metadata } from "next";
import SalesOrderMain from "./components/MainPage";

export const metadata: Metadata = {
  title: "HCMUT | SalesOrder",
};

const SalesOrderPage = () => {
  return (
    <div className="w-full h-full">
      <SalesOrderMain />
    </div>
  );
};

export default SalesOrderPage;
