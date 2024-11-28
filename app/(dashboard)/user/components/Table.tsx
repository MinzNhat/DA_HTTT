import Table from "@/components/table";
import { UserInfo } from "@/providers/PassedData";
import { columnsData } from "./variable/columnsData";
import CustomButton from "./CustomTableButton";

type TableProps = {
  reloadData: () => void;
  tableData: UserInfo[] | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedRows: UserInfo[];
  setSelectedRows: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  onRowClick: (_data: UserInfo) => void;
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
      primaryKey="name"
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
