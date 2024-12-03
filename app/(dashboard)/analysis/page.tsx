import { Metadata } from "next";
import AnalysisMain from "./components/MainPage";

export const metadata: Metadata = {
  title: "HCMUT | User",
};

const AnalysisPage = () => {
  return (
    <div className="w-full h-full">
      <AnalysisMain />
    </div>
  );
};

export default AnalysisPage;
