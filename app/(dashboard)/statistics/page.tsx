import { Metadata } from "next";
import StatisticsMain from "./components/MainPage";

export const metadata: Metadata = {
  title: "HCMUT | Statistics",
};

const UserPage = () => {
  return (
    <div className="w-full h-full">
      <StatisticsMain />
    </div>
  );
};

export default UserPage;
