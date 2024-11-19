import { Metadata } from "next";
import TerritoryMain from "./components/MainPage";

export const metadata: Metadata = {
  title: "HCMUT | Territory",
};

const TerritoryPage = () => {
  return (
    <div className="w-full h-full">
      <TerritoryMain />
    </div>
  );
};

export default TerritoryPage;
