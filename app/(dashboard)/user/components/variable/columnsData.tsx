import { UserInfo } from "@/providers/PassedData";
import { Column } from "react-table";

export const columnsData: Column<UserInfo>[] = [
  {
    Header: "Tên người dùng",
    accessor: "name",
  },
  {
    Header: "Chức vụ",
    accessor: "JobTitle",
  },
  {
    Header: "Số điện thoại",
    accessor: "PhoneNumber",
  },
  {
    Header: "Thành phố",
    accessor: "City",
  },
  {
    Header: "Địa chỉ 1",
    accessor: "AddressLine1",
  },
  {
    Header: "Địa chỉ 2",
    accessor: "AddressLine2",
  },
  {
    Header: "Quốc gia",
    accessor: "CountryRegionName",
  },
];
