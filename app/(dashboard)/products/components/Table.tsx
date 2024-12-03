import Table from "@/components/table";
import { ProductInfo } from "@/api_lib/Product";
import { createColumnsData } from "./variable/columnsData";
import CustomButton from "./CustomTableButton";
import { useIntl } from "react-intl";

type TableProps = {
    reloadData: () => void;
    tableData: ProductInfo[] | null;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    selectedRows: ProductInfo[];
    setSelectedRows: React.Dispatch<React.SetStateAction<ProductInfo[]>>;
    onRowClick: (_data: ProductInfo) => void;
    openAdd: () => void;
    handleDelete: () => void;
}

const ProductTable = ({ reloadData, tableData, currentPage, setCurrentPage, selectedRows, setSelectedRows, onRowClick, openAdd, handleDelete }: TableProps) => {
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
            customButton={<CustomButton fetchData={reloadData} selectedRows={selectedRows} openAdd={openAdd} handleDelete={handleDelete} />}
            customNoData={<>Không có lịch sử bài viết</>}
        />
    );
};

export default ProductTable;