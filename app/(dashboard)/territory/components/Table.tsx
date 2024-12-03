import Table from "@/components/table";
import { TerritoryInfo } from "@/api_lib/Territory";
import { createColumnsData } from "./variable/columnsData";
import CustomButton from "./CustomTableButton";
import { useIntl } from "react-intl";

type TableProps = {
  reloadData: () => void;
  tableData: TerritoryInfo[] | null;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedRows: TerritoryInfo[];
  setSelectedRows: React.Dispatch<React.SetStateAction<TerritoryInfo[]>>;
  onRowClick: (_data: TerritoryInfo) => void;
  openAdd: () => void;
};

const TerritoryTable = ({
  reloadData,
  tableData,
  currentPage,
  setCurrentPage,
  selectedRows,
  setSelectedRows,
  onRowClick,
  openAdd,
}: TableProps) => {
  const intl = useIntl();
  return (
    <Table
      isPaginated={true}
      selectType="multi"
      containerClassname="!rounded-lg p-4"
      fetchPageData={reloadData}
      tableData={tableData}
      columnsData={createColumnsData(intl)}
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
        />
      }
      customNoData={<>Không có lịch sử bài viết</>}
    />
  );
};

export default TerritoryTable;
