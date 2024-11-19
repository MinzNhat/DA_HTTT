import { Metadata } from "next";
import SpecialOfferMain from "./components/MainPage";

export const metadata: Metadata = {
  title: "HCMUT | SpecialOffer",
};

const SpecialOfferPage = () => {
  return (
    <div className="w-full h-full">
      <SpecialOfferMain />
    </div>
  );
};

export default SpecialOfferPage;
