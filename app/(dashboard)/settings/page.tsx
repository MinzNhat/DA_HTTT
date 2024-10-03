
import { Metadata } from "next";
import SettingsMain from "./components/MainPage";

export const metadata: Metadata = {
    title: 'HCMUT | Settings',
}

const SettingsPage = () => {
    return (
        <div className="w-full h-full">
            <SettingsMain />
        </div>
    );
};

export default SettingsPage;

