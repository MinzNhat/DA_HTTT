"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoShareOutline } from "react-icons/io5";
import { IoIosAdd, IoIosBrowsers } from "react-icons/io";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import RenderCase from "@/components/rendercase";
import NotiPopup from "@/components/notification";
import SubmitPopup from "@/components/submit";
import {
    CreateSalesOrderInfo,
    SalesOrderInfo,
    SalesOrderOperation,
} from "@/api_lib/SalesOrder";
import ProductTable from "./Table";
import SalesOrderFields from "./SalesOrderFields";
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

const SaleOrdersMain = () => {
    const intl = useIntl();
    const SalesOrderOp = new SalesOrderOperation();
    const [[page, direction], setPage] = useState([0, 0]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRows, setSelectedRows] = useState<SalesOrderInfo[]>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [salesOrderDetail, setSalesOrderDetail] = useState<SalesOrderInfo>({
        id: 0,
        SalesOrderDetail: [],
        OrderDate: "",
        DueDate: "",
        ShipDate: "",
        ShipMethod: "",
        Comment: "",
        SubTotal: "",
        TaxAmt: "",
        Freight: "",
        TotalDue: "",
        Employee: 0,
        Customer: 0,
        Territory: 0,
    });
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [openSalesOrderDetail, setOpenSalesOrderDetail] =
        useState<boolean>(false);
    const [openSubmitDelete, setOpenSubmitDelete] = useState<boolean>(false);
    const [salesOrderData, setSalesOrderData] = useState<CreateSalesOrderInfo>({
        SalesOrderDetail: [],
        OrderDate: "",
        DueDate: "",
        ShipDate: "",
        ShipMethod: "",
        Comment: "",
        SubTotal: "",
        TaxAmt: "",
        Freight: "",
        TotalDue: "",
        Employee: 0,
        Customer: 0,
        Territory: 0,
    });
    const [data, setData] = useState<SalesOrderInfo[] | null>(null);

    const reloadData = useCallback(async () => {
        setData(null);
        const token = localStorage?.getItem("accessToken");
        const response = await SalesOrderOp.getSaleOrder(
            { token },
            { currentPage }
        );
        if (response.data) {
            const responseData: SalesOrderInfo[] = response.data.map((offer) => ({
                ...offer,
                OrderDate: new Date(offer.OrderDate).toISOString().split("T")[0],
                DueDate: new Date(offer.DueDate).toISOString().split("T")[0],
                ShipDate: new Date(offer.ShipDate).toISOString().split("T")[0],
            }));
            setData(responseData);
        }
    }, [currentPage]);

    const openAdd = () => {
        setOpenSalesOrderDetail(false);
        paginate(1);
    };

    const openDetail = (data: SalesOrderInfo) => {
        setSalesOrderDetail(data);
        setOpenSalesOrderDetail(true);
        paginate(1);
    };

    const handleDelete = () => {
        if (selectedRows.length === 0) {
            setMessage(intl.formatMessage({ id: "NoSelected" }));
            setOpenNotification(true);
        } else {
            setMessage(`${intl.formatMessage({ id: "Delete1" })} ${selectedRows.length} ${intl.formatMessage({ id: "Delete2" })}?`);
            setOpenSubmitDelete(true);
        }
    };

    const confirmDelete = async () => {
        const token = localStorage?.getItem("accessToken");
        const idsToDelete = selectedRows.map((row) => row.id);

        let hasError = false;
        for (const id of idsToDelete) {
            try {
                const response = await SalesOrderOp.deleteSalesOrderInfo(
                    { token },
                    { salesOrderHeaderID: id.toString() }
                );
                if (response.error) {
                    hasError = true;
                    break;
                }
            } catch (error) {
                hasError = true;
                break;
            }
        }

        setOpenSubmitDelete(false);
        if (hasError) {
            setMessage(intl.formatMessage({ id: "HandleFail" }));
        } else {
            setMessage(intl.formatMessage({ id: "DeleteSuccess" }));
        }
        reloadData();
        setSelectedRows([]);
        setOpenNotification(true);
    };

    const submit = () => {
        if (openSalesOrderDetail) {
            submitUpdateSalesOrder(salesOrderDetail.id.toString());
        } else {
            submitCreateSalesOrder();
        }
    };

    const submitCreateSalesOrder = async () => {
        setLoading(true);
        if (!validateFields(salesOrderData)) return;

        const token = localStorage?.getItem("accessToken");
        const response = await SalesOrderOp.createSalesOrderInfo(
            { token },
            salesOrderData
        );

        if (response.error) {
            setMessage(intl.formatMessage({ id: "HandleFail" }));
        } else {
            setMessage(intl.formatMessage({ id: "CreateSuccess" }));
            paginate(0);
            reloadData();
        }
        setOpenNotification(true);
        setLoading(false);
    };

    const submitUpdateSalesOrder = async (id: string) => {
        setLoading(true);
        if (!validateFields(salesOrderDetail)) return;

        const token = localStorage?.getItem("accessToken");
        const updateData = {
            ...salesOrderDetail,
            id,
            customerID: salesOrderDetail.Customer,
            SalesOrderDetails: salesOrderDetail.SalesOrderDetail.map((detail) => ({
                productID: detail.id,
                OrderQty: detail.OrderQty,
            }))
        };

        const response = await SalesOrderOp.updateSpecialOfferInfo(
            { token },
            updateData
        );

        if (response.error) {
            setMessage(intl.formatMessage({ id: "HandleFail" }));
        } else {
            setMessage(intl.formatMessage({ id: "UpdateSuccess" }));
        }
        setOpenNotification(true);
        setLoading(false);
    };

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

    const handleChange = (id: keyof SalesOrderInfo, value: string | number) => {
        setSalesOrderDetail((prev) => ({ ...prev, [id]: value }));
    };

    const handleChange2 = (
        id: keyof CreateSalesOrderInfo,
        value: string | number
    ) => {
        setSalesOrderData((prev) => ({ ...prev, [id]: value }));
    };

    const validateFields = (data: CreateSalesOrderInfo) => {
        const missingFields = salesorderFields
            .filter(
                (field) =>
                    field.important && !data[field.id as keyof CreateSalesOrderInfo]
            )
            .map((field) => intl.formatMessage({ id: field.label }));

        if (missingFields.length > 0) {
            setMessage(
                `${intl.formatMessage({ id: "MissingMessage" })}: ${missingFields.join(", ")}`
            );
            setOpenNotification(true);
            return false;
        }
        return true;
    };

    const swipeConfidenceThreshold = 1;

    const salesorderFields: Array<{
        id: keyof SalesOrderInfo | CreateSalesOrderInfo;
        type: string;
        label: string;
        disable?: boolean;
        important?: boolean;
        onChange?: (
            id: keyof SalesOrderInfo | CreateSalesOrderInfo,
            value: string
        ) => void;
    }> = [
            { id: "OrderDate", type: "date", label: "SalesOrder.OrderDate", important: true },
            { id: "DueDate", type: "date", label: "SalesOrder.DueDate", important: true },
            { id: "ShipDate", type: "date", label: "SalesOrder.ShipDate", important: true },
            { id: "ShipMethod", type: "text", label: "SalesOrder.ShipMethod", important: true },
            { id: "Comment", type: "text", label: "SalesOrder.Comment", important: false },
            { id: "SubTotal", type: "text", label: "SalesOrder.SubTotal", important: true },
            { id: "TaxAmt", type: "text", label: "SalesOrder.TaxAmt", important: true },
            { id: "Freight", type: "text", label: "SalesOrder.Freight", important: true },
            { id: "TotalDue", type: "text", label: "SalesOrder.TotalDue", important: true },
            { id: "Employee", type: "number", label: "SalesOrder.Employee", important: true },
            { id: "Customer", type: "number", label: "SalesOrder.Customer", important: true },
            { id: "Territory", type: "number", label: "SalesOrder.Territory", important: true }
        ];

    const options = [
        {
            id: 0,
            component: (
                <ProductTable
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
                    {openSalesOrderDetail &&
                        <SalesOrderFields
                            data={salesOrderDetail}
                            handleChange={handleChange}
                            fields={salesorderFields}
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

            <RenderCase renderIf={openSubmitDelete}>
                <SubmitPopup
                    message={message}
                    onClose={() => {
                        setOpenSubmitDelete(false);
                    }}
                    submit={confirmDelete}
                />
            </RenderCase>
            <div className="sticky top-0 w-full flex gap-2 z-10 bg-white dark:bg-[#242526] h-12 min-h-12 px-2 justify-center place-items-center">
                <div className="gap-1 px-1 flex">
                    <FaAngleLeft
                        className={`w-5 h-5 ${page == 0 ? "text-gray-500 dark:text-darkContainerPrimary" : ""
                            }`}
                        onClick={() => {
                            paginate(0);
                        }}
                    />
                    <FaAngleRight
                        className={`w-5 h-5 ${page == 1 || !openSalesOrderDetail ? "text-gray-500 dark:text-darkContainerPrimary" : ""
                            }`}
                        onClick={() => {
                            paginate(openSalesOrderDetail ? 1 : 0);
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
                                        if (!openSalesOrderDetail) return;
                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(Math.min(page + 1, options.length - 1));
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(Math.max(page - 1, 0));
                                        }
                                    }}
                                    className={`inset-0 flex flex-col gap-4 w-full h-full overflow-y-auto no-scrollbar place-items-center ${page === 1 ? "mb-2" : ""
                                        }`}
                                >
                                    {indexoption.component}
                                </motion.div>
                            )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SaleOrdersMain;
