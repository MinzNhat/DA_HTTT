import { useThemeContext } from "@/providers/ThemeProvider";
import Image from "next/image";

const SettingTheme = () => {
    const { theme, setTheme } = useThemeContext();

    return (
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center space-y-4 md:space-y-0 md:space-x-4">
            <div
                onClick={() => setTheme("light")}
                className="w-64 p-1 rounded-md cursor-pointer flex flex-col gap-2 transition-all duration-300"
            >
                <Image
                    src="/light.png"
                    alt="Light Theme"
                    layout="responsive"
                    width={100}
                    height={60}
                    objectFit="contain"
                    className={`rounded-md  ${theme === "light" ? "border-[3px] border-blue-500" : ""}`}
                />
                <span className="text-base text-center">Light</span>
            </div>
            <div
                onClick={() => setTheme("dark")}
                className="w-64 p-1 rounded-md cursor-pointer flex flex-col gap-2 transition-all duration-300"
            >
                <Image
                    src="/dark.png"
                    alt="Dark Theme"
                    layout="responsive"
                    width={100}
                    height={60}
                    objectFit="contain"
                    className={`rounded-md  ${theme === "dark" ? "border-[3px] border-blue-500" : ""}`}
                />
                <span className="text-base text-center">Dark</span>
            </div>
        </div>
    );
};

export default SettingTheme;