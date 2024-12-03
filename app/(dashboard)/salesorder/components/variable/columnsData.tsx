import { SalesOrderInfo } from "@/api_lib/SalesOrder";
import { Column } from "react-table";
import { IntlShape } from "react-intl";

export const createColumnsData = (intl: IntlShape): Column<SalesOrderInfo>[] => [
  {
    Header: intl.formatMessage({ id: "SalesOrder.OrderDate" }),
    accessor: "OrderDate",
  },
  {
    Header: intl.formatMessage({ id: "SalesOrder.DueDate" }),
    accessor: "DueDate",
  },
  {
    Header: intl.formatMessage({ id: "SalesOrder.TotalDue" }),
    accessor: "TotalDue",
  },
  {
    Header: intl.formatMessage({ id: "SalesOrder.Comment" }),
    accessor: "Comment",
  },
];