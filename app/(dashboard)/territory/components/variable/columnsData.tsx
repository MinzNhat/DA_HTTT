import { TerritoryInfo } from "@/api_lib/Territory";
import { Column } from "react-table";

export const columnsData: Column<TerritoryInfo>[] = [
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
