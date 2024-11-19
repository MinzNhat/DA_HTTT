import { Metadata } from "next";
import UserMain from "./components/MainPage";

export const metadata: Metadata = {
  title: "HCMUT | User",
};

const UserPage = () => {
  return (
    <div className="w-full h-full">
      <UserMain />
    </div>
  );
};

export default UserPage;
