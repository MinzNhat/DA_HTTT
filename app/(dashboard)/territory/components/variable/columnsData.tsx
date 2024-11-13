import { ProductInfo } from "@/api_lib/Product";
import { Column } from "react-table";

export const columnsData: Column<ProductInfo>[] = [
  {
    Header: "Mã số",
    accessor: "id",
  },
  {
    Header: "Tên",
    accessor: "Name",
  },
  {
    Header: "Nhóm",
    accessor: "Group",
  },
  {
    Header: "SalesYTD",
    accessor: "SalesYTD",
  },
  {
    Header: "SalesLastYear",
    accessor: "SalesLastYear",
  },
];
