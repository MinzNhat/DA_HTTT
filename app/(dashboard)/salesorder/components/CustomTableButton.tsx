"use client";

import { SalesOrderInfo } from "@/api_lib/SalesOrder";
import { Button } from "@nextui-org/react";
import {
  MdRestartAlt,
  MdOutlineAddCircleOutline,
  MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import { FormattedMessage } from "react-intl";

interface CustomButtonProps {
  fetchData: () => void;
  selectedRows: SalesOrderInfo[];
  openAdd: () => void;
  handleDelete: () => void;
}

const CustomButton = ({
  fetchData,
  selectedRows,
  openAdd,
  handleDelete,
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
      <Button
        className={`w-full lg:w-fit col-span-2 flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-red-500 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
          linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}
        onClick={handleDelete}
      >
        <MdOutlineRemoveCircleOutline />
        <FormattedMessage id="DeleteButton" /> ({selectedRows.length})
      </Button>
    </div>
  );
};

export default CustomButton;
