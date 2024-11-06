import { ProductInfo } from "@/api_lib/Product";
import { Column } from "react-table";

export const columnsData: Column<ProductInfo>[] = [
    {
        Header: "Tên sản phẩm",
        accessor: "Name",
    },
    {
        Header: "Nhà sản xuất",
        accessor: "Manufacturer",
    },
    {
        Header: "Giá sản xuất",
        accessor: "ListPrice",
    },
    {
        Header: "Giá bán",
        accessor: "StandardCost",
    },
    {
        Header: "Kích cỡ",
        accessor: "Size",
    },
];