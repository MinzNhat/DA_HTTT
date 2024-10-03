
import { Metadata } from "next";
import MenuList from "./components/mainPage";

export const metadata: Metadata = {
    title: 'HCMUT | Menu',
}

const MenuMainPage = () => {
    return (
        <div className="w-full h-full">
            <MenuList />
        </div>
    );
};

export default MenuMainPage;

