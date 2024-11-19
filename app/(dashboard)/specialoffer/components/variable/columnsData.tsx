import { ProductInfo } from "@/api_lib/Product";
import { Column } from "react-table";

export const columnsData: Column<ProductInfo>[] = [
  {
    Header: "Mô tả",
    accessor: "Description",
  },
  {
    Header: "Ngày bắt đầu",
    accessor: "StartDate",
  },
  {
    Header: "Ngày kết thúc",
    accessor: "EndDate",
  },
  {
    Header: "Phần trăm giảm giá ",
    accessor: "DiscountPct",
  },
];
