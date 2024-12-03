import { ProductInfo } from "@/api_lib/Product";
import { Column } from "react-table";
import { IntlShape } from "react-intl";

export const createColumnsData = (intl: IntlShape): Column<ProductInfo>[] => [
    {
        Header: intl.formatMessage({ id: "Product.Name" }),
        accessor: "Name",
    },
    {
        Header: intl.formatMessage({ id: "Product.Manufacturer" }),
        accessor: "Manufacturer",
    },
    {
        Header: intl.formatMessage({ id: "Product.ListPrice" }),
        accessor: "ListPrice",
    },
    {
        Header: intl.formatMessage({ id: "Product.StandardCost" }),
        accessor: "StandardCost",
    },
    {
        Header: intl.formatMessage({ id: "Product.Size" }),
        accessor: "Size",
    },
];