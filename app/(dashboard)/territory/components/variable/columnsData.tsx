import { TerritoryInfo } from "@/api_lib/Territory";
import { Column } from "react-table";
import { IntlShape } from "react-intl";

export const createColumnsData = (intl: IntlShape): Column<TerritoryInfo>[] => [
  {
    Header: intl.formatMessage({ id: "Territory.Name" }),
    accessor: "Name",
  },
  {
    Header: intl.formatMessage({ id: "Territory.Group" }),
    accessor: "Group",
  },
  {
    Header: intl.formatMessage({ id: "Territory.SalesYTD" }),
    accessor: "SalesYTD",
  },
  {
    Header: intl.formatMessage({ id: "Territory.SalesLastYear" }),
    accessor: "SalesLastYear",
  },
];
