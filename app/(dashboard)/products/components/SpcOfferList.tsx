import { SpecialOfferInfo, SpecialOfferOperation } from '@/api_lib/SpecialOffer';
import { SpecialOfferProductrOperation } from '@/api_lib/SpecialOffer_Product';
import Table from '@/components/table';
import React, { useCallback, useEffect, useState } from 'react';
import { createColumnsData } from './variable/columnsData2';
import { FormattedMessage, useIntl } from 'react-intl';
import CustomButton from './CustomTableButton';
import RenderCase from '@/components/rendercase';
import SubmitPopup from '@/components/submit';
import NotiPopup from '@/components/notification';
import DetailPopup from '@/components/popup';
import { Button } from '@nextui-org/button';
import { MdRestartAlt } from 'react-icons/md';
import { motion } from 'framer-motion';
import LoadingUI from '@/components/loading';

const SpcOfferList = ({ productID }: { productID: number }) => {
    const intl = useIntl();
    const [specialOffers, setSpecialOffers] = useState<SpecialOfferInfo[] | null>();
    const spcOfferProduct = new SpecialOfferProductrOperation();
    const specialOfferOp = new SpecialOfferOperation();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPage2, setCurrentPage2] = useState<number>(1);
    const [selectedRows, setSelectedRows] = useState<SpecialOfferInfo[]>([]);
    const [selectedRows2, setSelectedRows2] = useState<SpecialOfferInfo[]>([]);
    const [openSubmitDelete, setOpenSubmitDelete] = useState<boolean>(false);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openAdd2, setOpenAdd2] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [openNotification2, setOpenNotification2] = useState<boolean>(false);
    const [data, setData] = useState<SpecialOfferInfo[] | null>(null);

    const reloadData = useCallback(async () => {
        setSpecialOffers(null);
        const token = localStorage?.getItem("accessToken");
        if (token) {
            const response = await spcOfferProduct.getSpecialOffer({ token }, { productID });
            if (response.data) {
                const responseData: SpecialOfferInfo[] = response.data.map((offer) => ({
                    ...offer,
                    StartDate: new Date(offer.StartDate).toISOString().split("T")[0],
                    EndDate: new Date(offer.EndDate).toISOString().split("T")[0],
                }));
                setSpecialOffers(responseData);
            }
        }
    }, [currentPage]);

    const reloadData2 = useCallback(async () => {
        setData(null);
        const token = localStorage?.getItem("accessToken");
        if (token) {
            const response = await specialOfferOp.getSpecialOffer(
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
        }
    }, [currentPage2]);

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
                const response = await spcOfferProduct.deleteSpecialOfferInfo(
                    { token },
                    { specialOfferID: id.toString(), productID: productID.toString() }
                );
                console.log({ specialOfferID: id.toString(), productID: productID.toString() })
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

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
    };

    const handleAddDiscount = async () => {
        const token = localStorage?.getItem("accessToken");
        if (!token) return;

        const existingIds = specialOffers?.map((offer) => offer.id) || [];
        const idsToAdd = selectedRows2.filter((row) => !existingIds.includes(row.id));

        if (idsToAdd.length === 0) {
            setOpenAdd(false);
            return;
        }

        setLoading(true);
        let hasError = false;

        for (const row of idsToAdd) {
            try {
                const response = await spcOfferProduct.createSpecialOfferInfo(
                    { token },
                    { specialOfferID: row.id.toString(), productID: productID.toString() }
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

        setLoading(false);
        setOpenAdd2(false);
        setOpenAdd(false);

        if (hasError) {
            setMessage(intl.formatMessage({ id: "AddFail" }));
        } else {
            setMessage(intl.formatMessage({ id: "AddSuccess" }));
            reloadData();
        }

        setOpenNotification(true);
    };

    const openAddDiscount = async () => {
        if (selectedRows2.length === 0) {
            setMessage(intl.formatMessage({ id: "NoSelected2" }));
            setOpenNotification2(true);
        } else {
            setMessage(`${intl.formatMessage({ id: "Add1" })} ${selectedRows2.length} ${intl.formatMessage({ id: "Add2" })} ${productID}?`);
            setOpenAdd2(true);
        }
    };

    useEffect(() => {
        reloadData();
        reloadData2();
    }, []);

    return (
        <div className='w-full flex gap-2 flex-col h-full'>
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
            <RenderCase renderIf={openAdd}>
                <DetailPopup
                    onClose={() => {
                        setOpenAdd(false);
                    }}
                    title={intl.formatMessage({ id: "AddDiscount" })}
                >
                    <RenderCase renderIf={openNotification2}>
                        <NotiPopup
                            message={message}
                            onClose={() => setOpenNotification2(false)}
                        />
                    </RenderCase>
                    <RenderCase renderIf={openAdd2}>
                        <SubmitPopup
                            message={message}
                            onClose={() => {
                                setOpenAdd2(false);
                            }}
                            submit={handleAddDiscount}
                        />
                    </RenderCase>
                    <Table
                        isPaginated={true}
                        selectType="multi"
                        containerClassname="!rounded-lg p-4"
                        fetchPageData={reloadData2}
                        tableData={data}
                        columnsData={createColumnsData(intl)}
                        currentPage={currentPage2}
                        setCurrentPage={setCurrentPage2}
                        currentSize={10}
                        primaryKey="id"
                        selectedRows={selectedRows2}
                        customButton={
                            <Button className={`col-span-1 w-full lg:w-fit flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
                            linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}
                                onClick={reloadData2}>
                                <MdRestartAlt /><FormattedMessage id="ReloadButton" />

                            </Button>
                        }
                        setSelectedRows={setSelectedRows2}
                        customNoData={<FormattedMessage id="NoDiscountData" />}
                    />
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full px-2 pb-2"
                    >
                        <button
                            onClick={openAddDiscount}
                            className="linear w-full !rounded-md bg-brand-500 py-[10px] text-base font-medium text-white transition duration-200 
                        hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center"
                        >
                            {loading ? (
                                <LoadingUI />
                            ) : (
                                intl.formatMessage({ id: "AddButton" })
                            )}
                        </button>
                    </motion.div>
                </DetailPopup>
            </RenderCase>
            <h1 className='font-semibold text-center'><FormattedMessage id="DiscountTitle" /></h1>
            <Table
                isPaginated={false}
                selectType="multi"
                containerClassname="!rounded-lg p-4"
                fetchPageData={reloadData}
                tableData={specialOffers}
                columnsData={createColumnsData(intl)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                currentSize={10}
                primaryKey="id"
                selectedRows={selectedRows}
                customButton={<CustomButton fetchData={reloadData} selectedRows={selectedRows} openAdd={() => setOpenAdd(true)} handleDelete={handleDelete} />}
                setSelectedRows={setSelectedRows}
                customNoData={<FormattedMessage id="NoDiscountData2" />}
            />
        </div>
    );
};

export default SpcOfferList;