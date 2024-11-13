import Table from "@/components/table";
import { SpecialOfferInfo } from "@/api_lib/SpecialOffer";
import { columnsData } from "./variable/columnsData";
import CustomButton from "./CustomTableButton";

type TableProps = {
  reloadData: () => void;
  tableData: SpecialOfferInfo[] | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedRows: SpecialOfferInfo[];
  setSelectedRows: React.Dispatch<React.SetStateAction<SpecialOfferInfo[]>>;
  onRowClick: (_data: SpecialOfferInfo) => void;
  openAdd: () => void;
  handleDelete: () => void;
};

const SpecialOfferTable = ({
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
      isPaginated={false}
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

export default SpecialOfferTable;
