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
    CreateSpecialOffer,
    SpecialOfferInfo,
    SpecialOfferOperation,
} from "@/api_lib/SpecialOffer";
import ProductTable from "./Table";
import SpecialOfferFields from "./SpecialOfferFields";
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

const SpecialOfferMain = () => {
    const intl = useIntl();
    const SpecialOfferOp = new SpecialOfferOperation();
    const [[page, direction], setPage] = useState([0, 0]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRows, setSelectedRows] = useState<SpecialOfferInfo[]>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [specialOfferDetail, setSpecialOfferDetail] =
        useState<SpecialOfferInfo>({
            id: 0,
            Description: "",
            DiscountPct: "",
            Type: "",
            StartDate: "",
            MinQty: 0,
            MaxQty: 0,
            EndDate: "",
        });
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [openSpecialOfferDetail, setOpenSpecialOfferDetail] =
        useState<boolean>(false);
    const [openSubmitDelete, setOpenSubmitDelete] = useState<boolean>(false);
    const [specialOfferData, setSpecialOfferData] = useState<CreateSpecialOffer>({
        Description: "",
        DiscountPct: "",
        Type: "",
        StartDate: "",
        EndDate: "",
        MinQty: 0,
        MaxQty: 0,
    });
    const [data, setData] = useState<SpecialOfferInfo[] | null>(null);

    const reloadData = useCallback(async () => {
        setData(null);
        const token = localStorage?.getItem("accessToken");
        const response = await SpecialOfferOp.getSpecialOffer(
            { token },
            { currentPage }
        );
        if (response.data) {
            const responseData: SpecialOfferInfo[] = response.data.map((offer) => ({
                ...offer,
                StartDate: new Date(offer.StartDate).toISOString().split("T")[0],
                EndDate: new Date(offer.EndDate).toISOString().split("T")[0],
            }));
            setData(responseData)
        };
    }, [currentPage]);

    const openAdd = () => {
        setOpenSpecialOfferDetail(false);
        paginate(1);
    };

    const openDetail = (data: SpecialOfferInfo) => {
        setSpecialOfferDetail(data);
        setOpenSpecialOfferDetail(true);
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
                const response = await SpecialOfferOp.deleteSpecialOfferInfo(
                    { token },
                    { specialOfferID: id.toString() }
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
        if (openSpecialOfferDetail) {
            submitUpdateSpecialOffer(specialOfferDetail.id.toString());
        } else {
            submitCreateSpecialOffer();
        }
    };

    const submitCreateSpecialOffer = async () => {
        setLoading(true);
        if (!validateFields(specialOfferData)) return;

        const token = localStorage?.getItem("accessToken");
        const createData = {
            ...specialOfferData,
            MinQty: typeof specialOfferData.MinQty === "string" ? parseFloat(specialOfferData.MinQty) : specialOfferData.MinQty,
            MaxQty: typeof specialOfferData.MaxQty === "string" ? parseFloat(specialOfferData.MaxQty) : specialOfferData.MaxQty,
        };
        const response = await SpecialOfferOp.createSpecialOfferInfo(
            { token },
            createData
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

    const submitUpdateSpecialOffer = async (specialOfferID: string) => {
        setLoading(true);
        if (!validateFields(specialOfferDetail)) return;

        const token = localStorage?.getItem("accessToken");
        const updateData = {
            ...specialOfferDetail,
            specialOfferID,
            MinQty: typeof specialOfferDetail.MinQty === "string" ? parseFloat(specialOfferDetail.MinQty) : specialOfferDetail.MinQty,
            MaxQty: typeof specialOfferDetail.MaxQty === "string" ? parseFloat(specialOfferDetail.MaxQty) : specialOfferDetail.MaxQty,
        };
        const response = await SpecialOfferOp.updateSpecialOfferInfo(
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

    const handleChange = (id: keyof SpecialOfferInfo, value: string) => {
        setSpecialOfferDetail((prev) => ({ ...prev, [id]: value }));
    };

    const handleChange2 = (id: keyof CreateSpecialOffer, value: string) => {
        setSpecialOfferData((prev) => ({ ...prev, [id]: value }));
    };

    const validateFields = (data: CreateSpecialOffer) => {
        const missingFields = specialOfferFields
            .filter(
                (field) =>
                    field.important && !data[field.id as keyof CreateSpecialOffer] && field.id !== "MinQty"
            )
            .map((field) => intl.formatMessage({ id: field.label }));
        const minQty = typeof data.MinQty === "string" ? parseFloat(data.MinQty) : data.MinQty
        const maxQty = typeof data.MaxQty === "string" ? parseFloat(data.MaxQty) : data.MaxQty
        const discountPct = typeof data.DiscountPct === "string" ? parseFloat(data.DiscountPct) : data.DiscountPct
        if (minQty >= maxQty) {
            setMessage(
                `${intl.formatMessage({ id: "SpcOffer.MinQty" })} ${intl.formatMessage({ id: "SpcOffer.LessThan" })} ${intl.formatMessage({ id: "SpcOffer.MaxQty" })}`
            );
            setLoading(false);
            setOpenNotification(true);
            return false;
        }
        if (discountPct > 1 || discountPct <= 0) {
            setMessage(
                `${intl.formatMessage({ id: "SpcOffer.DiscountPct" })} ${intl.formatMessage({ id: "SpcOffer.Range" })}`
            );
            setLoading(false);
            setOpenNotification(true);
            return false;
        }
        if (missingFields.length > 0) {
            setMessage(
                `${intl.formatMessage({ id: "MissingMessage" })}: ${missingFields.join(", ")}`
            );
            setLoading(false);
            setOpenNotification(true);
            return false;
        }
        return true;
    };

    const swipeConfidenceThreshold = 1;

    const specialOfferFields: Array<{
        id: keyof SpecialOfferInfo | CreateSpecialOffer;
        type: string;
        label: string;
        disable?: boolean;
        important?: boolean;
        onChange?: (
            id: keyof SpecialOfferInfo | CreateSpecialOffer,
            value: string
        ) => void;
    }> = [
            { id: "Description", type: "text", label: "SpcOffer.Description", important: true },
            {
                id: "DiscountPct",
                type: "text",
                label: "SpcOffer.DiscountPct",
                important: true,
            },
            { id: "Type", type: "text", label: "SpcOffer.Type", important: true },
            { id: "StartDate", type: "date", label: "SpcOffer.StartDate", important: true },
            { id: "EndDate", type: "date", label: "SpcOffer.EndDate", important: true },
            { id: "MinQty", type: "text", label: "SpcOffer.MinQty", important: true },
            { id: "MaxQty", type: "text", label: "SpcOffer.MaxQty", important: true },
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
                    <SpecialOfferFields
                        fields={specialOfferFields}
                        data={
                            openSpecialOfferDetail ? specialOfferDetail : specialOfferData
                        }
                        handleChange={openSpecialOfferDetail ? handleChange : handleChange2}
                    />
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
                        className={`w-5 h-5 ${page == 1 ? "text-gray-500 dark:text-darkContainerPrimary" : ""
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
                                    className={`inset-0 flex flex-col gap-4 w-full h-full overflow-y-auto no-scrollbar place-items-center ${page === 1 ? "mb-2" : ""
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
                        onClick={submit}
                        className="linear w-full !rounded-md bg-brand-500 py-[10px] text-base font-medium text-white transition duration-200 
                        hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center"
                    >
                        {loading ? (
                            <LoadingUI />
                        ) : openSpecialOfferDetail ? (
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

export default SpecialOfferMain;
