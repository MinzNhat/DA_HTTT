import { Metadata } from "next";
import ProductsMain from "./components/MainPage";

export const metadata: Metadata = {
  title: "HCMUT | User",
};

const UserPage = () => {
  return (
    <div className="w-full h-full">
      <ProductsMain />
    </div>
  );
};

export default UserPage;
