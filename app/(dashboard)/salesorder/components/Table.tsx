import Table from "@/components/table";
import { SalesOrderInfo } from "@/api_lib/SalesOrder";
import { columnsData } from "./variable/columnsData";
import CustomButton from "./CustomTableButton";

type TableProps = {
  reloadData: () => void;
  tableData: SalesOrderInfo[] | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedRows: SalesOrderInfo[];
  setSelectedRows: React.Dispatch<React.SetStateAction<SalesOrderInfo[]>>;
  onRowClick: (_data: SalesOrderInfo) => void;
  openAdd: () => void;
  handleDelete: () => void;
};

const ProductTable = ({
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
      customNoData={<>Không có lịch sử bài viết</>}
    />
  );
};

export default ProductTable;
