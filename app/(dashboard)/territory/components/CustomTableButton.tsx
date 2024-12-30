"use client";

import { ProductInfo } from "@/api_lib/Product";
import { TerritoryInfo } from "@/api_lib/Territory";
import { Button } from "@nextui-org/react";
import {
  MdRestartAlt,
} from "react-icons/md";
import { FormattedMessage } from "react-intl";

interface CustomButtonProps {
  fetchData: () => void;
}

const CustomButton = ({
  fetchData,
}: CustomButtonProps) => {
  return (
    <div className="grid grid-cols-2 lg:flex gap-3 h-full place-items-center w-full lg:w-fit">
      <Button
        className={`col-span-1 w-full lg:w-fit flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
          linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}
        onClick={fetchData}
      >
        <MdRestartAlt />
        <FormattedMessage id="ReloadButton" />

      </Button>
    </div>
  );
};

export default CustomButton;
