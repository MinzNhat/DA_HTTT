"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoShareOutline } from "react-icons/io5";
import { IoIosAdd, IoIosBrowsers } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import RenderCase from "@/components/rendercase";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import { UserOperation } from "@/api_lib/User";
import {
  CustomerInfo,
  CustomerStore,
  CustomerIndividual,
} from "@/api_lib/User";
import UserTable from "./Table";
import UserFields from "./UserFields";
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

const UsersMain = () => {
  const intl = useIntl();
  const UserOp = new UserOperation();
  const [[page, direction], setPage] = useState([0, 0]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<CustomerInfo[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<CustomerInfo>({
    id: 0,
    Employee: 0,
    Territory: 0,
    CustomerStore: {
      id: 0,
      Name: "",
      BusinessType: "",
      Specialty: "",
      AnnualSales: "",
      AnnualRevenue: "",
      YearOpened: 0,
      SquareFeet: 0,
      NumberOfEmployees: 0,
      City: "",
      AddressLine1: "",
      AddressLine2: "",
      CountryRegionName: "",
    },
    CustomerIndividual: {
      id: 0,
      FirstName: "",
      LastName: "",
      MiddleName: "",
      Title: "",
      EmailAddress: "",
      PhoneNumber: "",
      City: "",
      AddressLine1: "",
      AddressLine2: "",
      CountryRegionName: "",
    },
  });
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [openUserDetail, setOpenUserDetail] = useState<boolean>(false);
  const [openSubmitDelete, setOpenSubmitDelete] = useState<boolean>(false);
  const [data, setData] = useState<CustomerInfo[] | null>(null);

  const reloadData = useCallback(async () => {
    setData(null);
    const token = localStorage?.getItem("accessToken");
    const response = await UserOp.getAllUserInfo({ token }, { currentPage });
    if (response.data) setData(response.data);
  }, [currentPage]);

  const openAdd = () => {
    setOpenUserDetail(false);
    paginate(1);
  };

  const openDetail = (data: CustomerInfo) => {
    setUserDetail(data);
    setOpenUserDetail(true);
    paginate(1);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      setMessage(intl.formatMessage({ id: "NoSelected" }));
      setOpenNotification(true);
    } else {
      setMessage(
        `${intl.formatMessage({ id: "Delete1" })} ${
          selectedRows.length
        } ${intl.formatMessage({ id: "Delete2" })}?`
      );
      setOpenSubmitDelete(true);
    }
  };

  // const submit = () => {
  //   if (openUserDetail) {
  //     submitUpdateUser(userDetail.id);
  //   }
  // };

  // const submitUpdateUser = async (id: number) => {
  //   setLoading(true);
  //   if (!validateFields(userDetail)) return;

  //   const token = localStorage?.getItem("accessToken");
  //   const updateData = { ...userDetail, id };
  //   const response = await UserOp.updateUserInfo({ token }, updateData);

  //   if (response.error) {
  //     setMessage(intl.formatMessage({ id: "HandleFail" }));
  //   } else {
  //     setMessage(intl.formatMessage({ id: "UpdateSuccess" }));
  //   }
  //   setOpenNotification(true);
  //   setLoading(false);
  // };

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const paginate = useCallback(
    (targetPage: number) => {
      setPage([targetPage, targetPage - page]);
    },
    [page]
  );

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleChange = (id: NestedCustomerInfoKey, value: string) => {
    const [mainKey, subKey] = id.split(".");
    if (subKey) {
      setUserDetail((prev) => ({
        ...prev,
        [mainKey]: {
          ...prev[mainKey],
          [subKey]: value,
        },
      }));
    } else {
      setUserDetail((prev) => ({ ...prev, [id]: value }));
    }
  };

  const validateFields = (data: CustomerInfo) => {
    const missingFields = userFields
      .filter(
        (field) => field.important && !data[field.id as keyof CustomerInfo]
      )
      .map((field) => intl.formatMessage({ id: field.label }));

    if (missingFields.length > 0) {
      setMessage(
        `${intl.formatMessage({ id: "MissingMessage" })}: ${missingFields.join(
          ", "
        )}`
      );
      setOpenNotification(true);
      return false;
    }
    return true;
  };

  const swipeConfidenceThreshold = 1;

  type NestedCustomerInfoKey =
    | keyof CustomerInfo
    | `CustomerStore.${keyof CustomerStore}`
    | `CustomerIndividual.${keyof CustomerIndividual}`;

  const userFields: Array<{
    id: NestedCustomerInfoKey;
    type: string;
    label: string;
    disable?: boolean;
    important?: boolean;
    onChange?: (id: NestedCustomerInfoKey, value: string) => void;
  }> = [
    {
      id: "CustomerStore.Name",
      type: "text",
      label: "Store.Name",
      important: true,
    },
    {
      id: "CustomerStore.BusinessType",
      type: "text",
      label: "Store.BusinessType",
      important: true,
    },
    {
      id: "CustomerStore.Specialty",
      type: "text",
      label: "Store.Specialty",
      important: true,
    },
    {
      id: "CustomerStore.AnnualSales",
      type: "text",
      label: "Store.AnnualSales",
      important: true,
    },
    {
      id: "CustomerStore.AnnualRevenue",
      type: "text",
      label: "Store.AnnualRevenue",
      important: true,
    },
    {
      id: "CustomerIndividual.LastName",
      type: "text",
      label: "Individual.LastName",
      important: true,
    },
    {
      id: "CustomerIndividual.EmailAddress",
      type: "text",
      label: "Individual.EmailAddress",
      important: true,
    },
    {
      id: "CustomerIndividual.PhoneNumber",
      type: "text",
      label: "Individual.PhoneNumber",
      important: true,
    },
  ];

  const getNestedFieldValue = (
    data: CustomerInfo,
    id: NestedCustomerInfoKey
  ): string => {
    const keys = id.split(".");
    if (keys.length === 1) {
      return data[keys[0] as keyof CustomerInfo]
        ? data[keys[0] as keyof CustomerInfo]!.toString()
        : "không có dữ liệu";
    } else if (keys.length === 2) {
      const [parentKey, childKey] = keys;
      if (parentKey === "CustomerStore" && data.CustomerStore) {
        return data.CustomerStore[childKey as keyof CustomerStore]
          ? data.CustomerStore[childKey as keyof CustomerStore]!.toString()
          : "không có dữ liệu";
      } else if (
        parentKey === "CustomerIndividual" &&
        data.CustomerIndividual
      ) {
        return data.CustomerIndividual[childKey as keyof CustomerIndividual]
          ? data.CustomerIndividual[
              childKey as keyof CustomerIndividual
            ]!.toString()
          : "không có dữ liệu";
      }
    }
    return "không có dữ liệu";
  };

  console.log(userDetail);

  const options = [
    {
      id: 0,
      component: (
        <UserTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          tableData={data}
          openAdd={openAdd}
          reloadData={reloadData}
          onRowClick={openDetail}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleDelete={handleDelete}
        />
      ),
    },
    {
      id: 1,
      component: (
        <div className="flex flex-col gap-4 w-full h-full md:w-1/2 p-4">
          {
            /* {openUserDetail ? ( */
            <UserFields
              data={userDetail}
              handleChange={handleChange}
              fields={userFields}
            />
          }
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
        >
          <button
            // onClick={submit}
            className="linear w-full !rounded-md bg-brand-500 py-[10px] text-base font-medium text-white transition duration-200 
                        hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center"
          >
            {loading ? (
              <LoadingUI />
            ) : openUserDetail ? (
              intl.formatMessage({ id: "EditButton" })
            ) : (
              intl.formatMessage({ id: "AddButtonConfirm" })
            )}
          </button>
        </motion.div>
      </RenderCase>
    </div>
  );
};

export default UsersMain;
