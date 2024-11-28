"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoShareOutline } from "react-icons/io5";
import { IoIosAdd, IoIosBrowsers } from "react-icons/io";
import RenderCase from "@/components/rendercase";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { TerritoryInfo, TerritoryOperation } from "@/api_lib/Territory";
import TerritoryTable from "./Table";
import TerritoryFields from "./TeritoryFields";
import { useIntl } from "react-intl";
import LoadingUI from "@/components/loading";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
};

const TerritoryMain = () => {
  const intl = useIntl();
  const TerritoryOp = new TerritoryOperation();
  const [[page, direction], setPage] = useState([0, 0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<TerritoryInfo[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [territoryDetail, setTerritoryDetail] = useState<TerritoryInfo>({
    id: 0,
    Name: "",
    Group: "",
    SalesYTD: "",
    SalesLastYear: "",
  });
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openTerritoryDetail, setOpenTerritoryDetail] =
    useState<boolean>(false);
  const [territoryData, setTerritoryData] = useState<TerritoryInfo>({
    id: 0,
    Name: "",
    Group: "",
    SalesYTD: "",
    SalesLastYear: "",
  });
  const [data, setData] = useState<TerritoryInfo[] | null>(null);

  const reloadData = useCallback(async () => {
    setData(null);
    const token = localStorage?.getItem("accessToken");
    const response = await TerritoryOp.getTerritory({ token }, { currentPage });
    if (response.data) setData(response.data);
  }, [currentPage]);

  const openAdd = () => {
    setOpenTerritoryDetail(false);
    paginate(1);
  };

  const openDetail = (data: TerritoryInfo) => {
    setTerritoryDetail(data);
    setOpenTerritoryDetail(true);
    paginate(1);
  };

  const paginate = useCallback(
    (targetPage: number) => {
      setPage([targetPage, targetPage - page]);
    },
    [page]
  );

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleChange = (id: keyof TerritoryInfo, value: string) => {
    setTerritoryDetail((prev) => ({ ...prev, [id]: value }));
  };

  const handleChange2 = (id: keyof TerritoryInfo, value: string) => {
    setTerritoryData((prev) => ({ ...prev, [id]: value }));
  };

  const validateFields = (data: TerritoryInfo) => {
    const missingFields = territoryFields
      .filter(
        (field) => field.important && !data[field.id as keyof TerritoryInfo]
      )
      .map((field) => intl.formatMessage({ id: field.label }));

    if (missingFields.length > 0) {
      setMessage(
        `Vui lòng điền đầy đủ các thông tin sau: ${missingFields.join(", ")}`
      );
      setOpenNotification(true);
      return false;
    }
    return true;
  };

  const swipeConfidenceThreshold = 1;

  const territoryFields: Array<{
    id: keyof TerritoryInfo;
    type: string;
    label: string;
    disable?: boolean;
    important?: boolean;
    onChange?: (id: keyof TerritoryInfo, value: string) => void;
  }> = [
    { id: "Name", type: "text", label: "Territory.Name", important: true },
    { id: "Group", type: "text", label: "Territory.Group", important: true },
    {
      id: "SalesYTD",
      type: "text",
      label: "Territory.SalesYTD",
      important: true,
    },
    {
      id: "SalesLastYear",
      type: "text",
      label: "Territory.SalesLastYear",
      important: true,
    },
  ];

  const options = [
    {
      id: 0,
      component: (
        <TerritoryTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          tableData={data}
          openAdd={openAdd}
          reloadData={reloadData}
          onRowClick={openDetail}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      ),
    },
    {
      id: 1,
      component: (
        <div className="flex flex-col gap-4 w-full h-full md:w-1/2 p-4">
          {openTerritoryDetail ? (
            <TerritoryFields
              data={territoryDetail}
              handleChange={handleChange}
              fields={territoryFields}
            />
          ) : (
            <TerritoryFields
              data={territoryData}
              handleChange={handleChange2}
              fields={territoryFields}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex place-items-center dark:text-white relative flex-col h-full">
      <RenderCase renderIf={openNotification}>
        <NotiPopup
          message={message}
          onClose={() => setOpenNotification(false)}
        />
      </RenderCase>

      <div className="sticky top-0 w-full flex gap-2 z-10 bg-white dark:bg-[#242526] h-12 min-h-12 px-2 justify-center place-items-center">
        <div className="gap-1 px-1 flex">
          <FaAngleLeft
            className={`w-5 h-5 ${
              page == 0 ? "text-gray-500 dark:text-darkContainerPrimary" : ""
            }`}
            onClick={() => {
              paginate(0);
            }}
          />
          <FaAngleRight
            className={`w-5 h-5 ${
              page == 1 ? "text-gray-500 dark:text-darkContainerPrimary" : ""
            }`}
            onClick={() => {
              paginate(1);
            }}
          />
        </div>

        <div className="dark:bg-[#3A3B3C] bg-lightPrimary rounded-full flex w-full h-9 overflow-clip relative"></div>

        <div className="gap-2 px-1 flex">
          <IoShareOutline className="w-5 h-5" />
          <IoIosAdd className="w-6 h-6" />
          <IoIosBrowsers className="w-5 h-5" />
        </div>
      </div>

      <div className="w-full relative overflow-y-auto no-scrollbar flex flex-col gap-4 h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {options.map(
            (indexoption) =>
              indexoption.id === page && (
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    opacity: { duration: 0.3 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(Math.min(page + 1, options.length - 1));
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(Math.max(page - 1, 0));
                    }
                  }}
                  className={`inset-0 flex flex-col gap-4 w-full h-full overflow-y-auto no-scrollbar place-items-center ${
                    page === 1 ? "mb-2" : ""
                  }`}
                >
                  {indexoption.component}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
      <RenderCase renderIf={page === 1}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full px-2 pb-2"
        ></motion.div>
      </RenderCase>
    </div>
  );
};

export default TerritoryMain;
