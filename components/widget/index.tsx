import { FC, ReactNode } from "react";
import Card from "@/components/card";
import { FaSyncAlt } from "react-icons/fa";

type Props = {
  icon?: ReactNode | string;
  title?: string;
  subtitle?: string;
  onReload?: () => void;
};

const Widget: FC<Props> = ({ icon, title, subtitle, onReload }) => {
  return (
    <Card className="!flex-row flex-grow items-center rounded-[20px]">
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-blue-500">
          <span className="flex items-center text-blue-500 dark:text-white">
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-full flex-col justify-center text-center">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        <h4 className="text-xl font-bold text-blue-500 dark:text-white">
          {subtitle}
        </h4>
      </div>

      <button
        onClick={onReload}
        className="ml-auto mr-4 p-2 rounded-full text-blue-500 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <FaSyncAlt className="w-5 h-5" />
      </button>
    </Card>
  );
};

export default Widget;