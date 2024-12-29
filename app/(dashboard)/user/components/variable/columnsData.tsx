import { CustomerInfo } from "@/api_lib/User";
import { Column } from "react-table";

const getDisplayValue = (value: any): string => {
  return value ? value.toString() : "không có dữ liệu";
};

export const columnsData: Column<CustomerInfo>[] = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Lãnh thổ",
    accessor: (row) => getDisplayValue(row.Territory),
  },
  {
    Header: "ID cửa hàng",
    accessor: (row) => getDisplayValue(row.CustomerStore?.id),
  },
  {
    Header: "Tên cửa hàng",
    accessor: (row) => getDisplayValue(row.CustomerStore?.Name),
  },
  {
    Header: "Loại hình kinh doanh",
    accessor: (row) => getDisplayValue(row.CustomerStore?.BusinessType),
  },
  {
    Header: "ID cá nhân",
    accessor: (row) => getDisplayValue(row.CustomerIndividual?.id),
  },
  {
    Header: "Tên",
    accessor: (row) => getDisplayValue(row.CustomerIndividual?.LastName),
  },
  {
    Header: "Chức danh",
    accessor: (row) => getDisplayValue(row.CustomerIndividual?.Title),
  },
];
