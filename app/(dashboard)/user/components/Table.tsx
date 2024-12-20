import Table from "@/components/table";
import { CustomerInfo } from "@/api_lib/User";
import { columnsData } from "./variable/columnsData";
import CustomButton from "./CustomTableButton";
import { useIntl } from "react-intl";

type TableProps = {
  reloadData: () => void;
  tableData: CustomerInfo[] | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedRows: CustomerInfo[];
  setSelectedRows: React.Dispatch<React.SetStateAction<CustomerInfo[]>>;
  onRowClick: (_data: CustomerInfo) => void;
  openAdd: () => void;
  handleDelete: () => void;
};

const UserTable = ({
  reloadData,
  tableData,
  currentPage,
  setCurrentPage,
  selectedRows,
  setSelectedRows,
  onRowClick,
  openAdd,
  handleDelete,
}: TableProps) => {
  return (
    <Table
      isPaginated={true}
      selectType="multi"
      containerClassname="!rounded-lg p-4"
      fetchPageData={reloadData}
      tableData={tableData}
      columnsData={columnsData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      currentSize={10}
      primaryKey="id"
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
      onRowClick={onRowClick}
      customButton={
        <CustomButton
          fetchData={reloadData}
          selectedRows={selectedRows}
          openAdd={openAdd}
          handleDelete={handleDelete}
        />
      }
      customNoData={<>Không có lịch sử người dùng</>}
    />
  );
};

export default UserTable;
