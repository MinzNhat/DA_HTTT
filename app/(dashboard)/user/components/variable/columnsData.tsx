import { CustomerInfo } from "@/api_lib/User";
import { IntlShape } from "react-intl";
import { Column } from "react-table";

const getDisplayValue = (value: any): string => {
  return value ? value.toString() : "Không có dữ liệu";
};

export const createColumnsData = (intl: IntlShape): Column<CustomerInfo>[] => [
  {
    Header: intl.formatMessage({ id: "User.Territory" }),
    accessor: (row) => getDisplayValue(row.Territory),
  },
  {
    Header: intl.formatMessage({ id: "Store.Name" }),
    accessor: (row) => getDisplayValue(row.CustomerStore?.Name),
  },
  {
    Header: intl.formatMessage({ id: "Store.BusinessType" }),
    accessor: (row) => getDisplayValue(row.CustomerStore?.BusinessType),
  },
  {
    Header: intl.formatMessage({ id: "Individual.LastName" }),
    accessor: (row) => getDisplayValue(row.CustomerIndividual?.LastName),
  },
  {
    Header: intl.formatMessage({ id: "User.Role" }),
    accessor: (row) => getDisplayValue(row.CustomerIndividual?.Title),
  },
];
