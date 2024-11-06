'use client'
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoShareOutline } from "react-icons/io5";
import { IoIosAdd, IoIosBrowsers } from 'react-icons/io';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import RenderCase from '@/components/rendercase';
import NotiPopup from '@/components/notification';
import SubmitPopup from '@/components/submit';
import { CreateProductInfo, ProductInfo, ProductOperation } from '@/api_lib/Product';
import ProductTable from './Table';
import ProductFields from './ProductFields';
import { useIntl } from 'react-intl';
import LoadingUI from '@/components/loading';

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0
        };
    }
};

const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
};

const ProductsMain = () => {
    const intl = useIntl()
    const ProductOp = new ProductOperation();
    const [[page, direction], setPage] = useState([0, 0]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRows, setSelectedRows] = useState<ProductInfo[]>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [productDetail, setProductDetail] = useState<ProductInfo>({
        id: 0,
        Name: "",
        Manufacturer: "",
        Summary: "",
        WarrantyPeriod: "",
        RiderExperience: "",
        Description: "",
        Size: "",
        Style: "",
        StandardCost: "",
        ListPrice: "",
    });
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [openProductDetail, setOpenProductDetail] = useState<boolean>(false);
    const [openSubmitDelete, setOpenSubmitDelete] = useState<boolean>(false);
    const [productData, setProductData] = useState<CreateProductInfo>({
        Name: "",
        Manufacturer: "",
        Summary: "",
        WarrantyPeriod: "",
        RiderExperience: "",
        Description: "",
        Size: "",
        Style: "",
        StandardCost: "",
        ListPrice: "",
    });
    const [data, setData] = useState<ProductInfo[] | null>(null);

    const reloadData = useCallback(async () => {
        setData(null);
        const token = localStorage?.getItem('accessToken');
        const response = await ProductOp.getSpecialOffer({ token });
        if (response.data) setData(response.data)
    }, []);

    const openAdd = () => {
        setOpenProductDetail(false);
        paginate(1);
    };

    const openDetail = (data: ProductInfo) => {
        setProductDetail(data);
        setOpenProductDetail(true);
        paginate(1);
    };

    const handleDelete = () => {
        if (selectedRows.length === 0) {
            setMessage("Vui lòng chọn sản phẩm muốn xoá");
            setOpenNotification(true);
        } else {
            setMessage(`Xác nhận xoá ${selectedRows.length} sản phẩm đã chọn?`);
            setOpenSubmitDelete(true);
        }
    };

    const confirmDelete = async () => {
        const token = localStorage?.getItem('accessToken');
        const idsToDelete = selectedRows.map(row => row.id);

        let hasError = false;
        for (const id of idsToDelete) {
            try {
                const response = await ProductOp.deleteProductInfo({ token }, { productID: id.toString() });
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
            setMessage("Đã có lỗi xảy ra trong quá trình xóa 1 số sản phẩm");

        } else {
            setMessage("Xóa sản phẩm thành công.");
        }
        reloadData();
        setSelectedRows([]);
        setOpenNotification(true);
    };

    const submit = () => {
        if (openProductDetail) {
            submitUpdateProduct(productDetail.id.toString());
        } else {
            submitCreateProduct();
        }
    };

    const submitCreateProduct = async () => {
        setLoading(true)
        if (!validateFields(productData)) return;

        const token = localStorage?.getItem('accessToken');
        const response = await ProductOp.createProductInfo({ token }, productData);

        if (response.error) {
            setMessage("Đã có lỗi xảy ra, vui lòng thử lại sau");
        } else {
            setMessage("Tạo sản phẩm thành công");
        }
        setOpenNotification(true);
        setLoading(false)
    };

    const submitUpdateProduct = async (productID: string) => {
        setLoading(true)
        if (!validateFields(productDetail)) return;

        const token = localStorage?.getItem('accessToken');
        const updateData = { ...productData, productID };
        const response = await ProductOp.updateProductInfo({ token }, updateData);

        if (response.error) {
            setMessage("Đã có lỗi xảy ra, vui lòng thử lại sau");
        } else {
            setMessage("Cập nhật sản phẩm thành công");
        }
        setOpenNotification(true);
        setLoading(false)
    };

    useEffect(() => {
        reloadData();
    }, [reloadData]);


    const paginate = useCallback((targetPage: number) => {
        setPage([targetPage, targetPage - page]);
    }, [page]);

    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const handleChange = (id: keyof ProductInfo, value: string) => {
        setProductDetail(prev => ({ ...prev, [id]: value }));
    };

    const handleChange2 = (id: keyof CreateProductInfo, value: string) => {
        setProductData(prev => ({ ...prev, [id]: value }));
    };

    const validateFields = (data: CreateProductInfo) => {
        const missingFields = productFields
            .filter(field => field.important && !data[field.id as keyof CreateProductInfo])
            .map(field => intl.formatMessage({ id: field.label }));

        if (missingFields.length > 0) {
            setMessage(`Vui lòng điền đầy đủ các thông tin sau: ${missingFields.join(', ')}`);
            setOpenNotification(true);
            return false;
        }
        return true;
    };

    const swipeConfidenceThreshold = 1;

    const productFields: Array<{
        id: keyof ProductInfo | CreateProductInfo;
        type: string;
        label: string;
        disable?: boolean;
        important?: boolean;
        onChange?: (id: keyof ProductInfo | CreateProductInfo, value: string) => void;
    }> = [
            { id: "Name", type: "text", label: "Product.Name", important: true },
            { id: "Manufacturer", type: "text", label: "Product.Manufacturer", important: true },
            { id: "Summary", type: "text", label: "Product.Summary", important: true },
            { id: "WarrantyPeriod", type: "text", label: "Product.WarrantyPeriod", important: true },
            { id: "RiderExperience", type: "text", label: "Product.RiderExperience", important: true },
            { id: "Description", type: "text", label: "Product.Description", important: true },
            { id: "Size", type: "text", label: "Product.Size", important: true },
            { id: "Style", type: "text", label: "Product.Style", important: true },
            { id: "ListPrice", type: "text", label: "Product.ListPrice", important: true },
            { id: "StandardCost", type: "text", label: "Product.StandardCost", important: true },
        ];

    const options = [
        {
            id: 0, component: <ProductTable currentPage={currentPage} setCurrentPage={setCurrentPage} tableData={data} openAdd={openAdd}
                reloadData={reloadData} onRowClick={openDetail} selectedRows={selectedRows} setSelectedRows={setSelectedRows} handleDelete={handleDelete} />
        },
        {
            id: 1,
            component:
                <div className='flex flex-col gap-4 w-full h-full md:w-1/2 p-4'>
                    {openProductDetail ?
                        <ProductFields data={productDetail} handleChange={handleChange} fields={productFields} />
                        :
                        <ProductFields data={productData} handleChange={handleChange2} fields={productFields} />
                    }
                </div>
        },
    ];

    return (
        <div className="flex place-items-center dark:text-white relative flex-col h-full">
            <RenderCase renderIf={openNotification}>
                <NotiPopup message={message} onClose={() => setOpenNotification(false)} />
            </RenderCase>

            <RenderCase renderIf={openSubmitDelete}>
                <SubmitPopup message={message} onClose={() => { setOpenSubmitDelete(false); }} submit={confirmDelete} />
            </RenderCase>
            <div className="sticky top-0 w-full flex gap-2 z-10 bg-white dark:bg-[#242526] h-12 min-h-12 px-2 justify-center place-items-center">
                <div className='gap-1 px-1 flex'>
                    <FaAngleLeft className={`w-5 h-5 ${page == 0 ? 'text-gray-500 dark:text-darkContainerPrimary' : ''}`} onClick={() => { paginate(0) }} />
                    <FaAngleRight className={`w-5 h-5 ${page == 1 ? 'text-gray-500 dark:text-darkContainerPrimary' : ''}`} onClick={() => { paginate(1) }} />
                </div>

                <div className='dark:bg-[#3A3B3C] bg-lightPrimary rounded-full flex w-full h-9 overflow-clip relative'>

                </div>

                <div className='gap-2 px-1 flex'>
                    <IoShareOutline className='w-5 h-5' />
                    <IoIosAdd className='w-6 h-6' />
                    <IoIosBrowsers className='w-5 h-5' />
                </div>
            </div>

            <div className="w-full relative overflow-y-auto no-scrollbar flex flex-col gap-4 h-full">
                <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                    {options.map(indexoption => (
                        indexoption.id === page && (
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    opacity: { duration: 0.3 }
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
                                className={`inset-0 flex flex-col gap-4 w-full h-full overflow-y-auto no-scrollbar place-items-center ${page === 1 ? "mb-2" : ""}`}
                            >
                                {indexoption.component}
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
            <RenderCase renderIf={page === 1}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='w-full px-2 pb-2'
                >
                    <button
                        onClick={submit}
                        className="linear w-full !rounded-md bg-brand-500 py-[10px] text-base font-medium text-white transition duration-200 
                        hover:bg-brand-600 active:bg-brand-700 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 flex justify-center"
                    >
                        {loading ? <LoadingUI /> : openProductDetail ? 'Chỉnh sửa' : 'Xác nhận tạo'}
                    </button>
                </motion.div>
            </RenderCase>
        </div>
    );
};

export default ProductsMain;