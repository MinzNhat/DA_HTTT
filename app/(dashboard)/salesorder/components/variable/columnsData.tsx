import { ProductInfo } from "@/api_lib/Product";
import { Column } from "react-table";

export const columnsData: Column<ProductInfo>[] = [
  {
    Header: "Ngày đặt hàng",
    accessor: "OrderDate",
  },
  {
    Header: "Ngày nhận hàng (dự kiến)",
    accessor: "DueDate",
  },
  {
    Header: "Số tiền thanh toán",
    accessor: "TotalDue",
  },
  {
    Header: "Bình luận",
    accessor: "Comment",
  },
];
