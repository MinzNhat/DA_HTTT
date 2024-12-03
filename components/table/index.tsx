//@ts-nocheck
"use client";

import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable
} from "react-table";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import LoadingUI from "@/components/loading";
import { Checkbox } from "@nextui-org/react";
import Dropdown from "@/components/dropdown";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdNavigateBefore, MdNavigateNext, MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { SetTableSizeProps, TableData, TableProps } from "./types/table-config";
import Card from "../card";
import RenderCase from "../rendercase";
import { FormattedMessage, useIntl } from "react-intl";

const CheckTableV1 = <T extends TableData>(props: TableProps<T>) => {
    const intl = useIntl();
    const {
        columnsData, tableData, selectedRows, setSelectedRows, primaryKey, currentPage, currentSize, isPaginated = false, fetchPageData,
        customButton, containerClassname, customNoData, maxPage, onRowClick, renderCell, renderHeader, selectType = 'multi', setCurrentPage, setPageSize,
    } = props;

    const { sizeOptions, setCurrentSize }: SetTableSizeProps | { sizeOptions: undefined, setCurrentSize: undefined }
        = setPageSize ? setPageSize : { sizeOptions: undefined, setCurrentSize: undefined };
    const [searchValue, setSearchValue] = useState("");
    // const TableMessage = useTranslations('Table');

    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData || [], [tableData]);

    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: {
                pageSize: currentSize,
            },
            manualPagination: isPaginated,
        },
        useGlobalFilter, useSortBy, usePagination
    );

    const {
        getTableProps, getTableBodyProps, headerGroups, page, prepareRow, canPreviousPage, canNextPage, gotoPage, setGlobalFilter, pageCount,
    } = tableInstance;

    const isRowSelected = useCallback(
        (row: T) => selectedRows.some(selectedRow => selectedRow[primaryKey] === row[primaryKey]),
        [selectedRows, primaryKey]
    );

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const allRowsOnPageSelected = page.every(row => selectedRows.some(selectedRow => selectedRow[primaryKey] === row.original[primaryKey]));

        if (allRowsOnPageSelected) {
            const newSelectedRows = selectedRows.filter(selectedRow => !page.some(row => row.original[primaryKey] === selectedRow[primaryKey]));
            setSelectedRows(newSelectedRows);
        } else {
            const newSelectedRows = [
                ...selectedRows,
                ...page.filter(row => !selectedRows.some(selectedRow => selectedRow[primaryKey] === row.original[primaryKey])).map(row => row.original),
            ];
            setSelectedRows(newSelectedRows);
        }
    };

    const toggleRowSelection = useCallback(
        (row: T, e: React.MouseEvent<HTMLInputElement>) => {
            e.stopPropagation();
            const isSelected = isRowSelected(row);
            let newSelectedRows;

            if (selectType === 'multi') {
                newSelectedRows = isSelected
                    ? selectedRows.filter(selectedRow => selectedRow[primaryKey] !== row[primaryKey])
                    : [...selectedRows, row];
            } else {
                newSelectedRows = isSelected ? [] : [row];
            }

            setSelectedRows(newSelectedRows);
        },
        [isRowSelected, selectedRows, primaryKey, selectType, setSelectedRows]
    );


    const handleFetchPageData = useCallback(
        () => { if (isPaginated) fetchPageData(currentPage, currentSize) },
        [fetchPageData, currentPage, currentSize]
    );

    const previousClick = () => {
        const newPage = currentPage - 1;

        if (newPage >= 1) {
            setCurrentPage(newPage);
            gotoPage(newPage - 1);
        }
    };

    const nextClick = () => {
        const newPage = currentPage + 1;
        const targetPage = isPaginated ? (maxPage ?? Infinity) : pageCount;

        if (newPage <= targetPage) {
            setCurrentPage(newPage);
            gotoPage(newPage - 1);
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = Math.max(0, Number(e.target.value) || 0);
        const targetPage = isPaginated ? maxPage || Infinity : pageCount;

        setCurrentPage(Math.min(inputValue, targetPage));
        gotoPage(Math.min(inputValue - 1, targetPage - 1));
    };

    const RowClickHandler = (row: T) => {
        if (onRowClick) { onRowClick(row); };
    };

    const ChangeCurrentSize = (value: number) => {
        if (setCurrentSize) { setCurrentSize(value); };
    };

    useEffect(() => {
        handleFetchPageData();
    }, [currentPage, currentSize, handleFetchPageData]);

    return (
        <Card className={`h-full w-full flex flex-col gap-3 ${containerClassname}`}>
            <div className="flex justify-between items-center flex-col lg:flex-row">
                <div className={`relative flex items-center bg-lightPrimary rounded-full text-navy-700 
                    dark:bg-darkContainerPrimary dark:text-white w-full ${!!customButton ? 'lg:mr-4 mb-3 lg:mb-0' : ''}`}>
                    <motion.button
                        className="text lg h-10 w-8 px-2 ml-2 flex justify-center rounded-full place-items-center"
                        initial={{ left: 2 }}
                    >
                        <FiSearch
                            className="h-4 w-4 text-navy-800 dark:text-white"
                        />
                    </motion.button>

                    <input
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            setGlobalFilter(e.target.value);
                        }}
                        type="text"
                        placeholder={intl.formatMessage({ id: "Search.Placeholder" })}
                        className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-800 dark:text-white
                        placeholder:text-navy-800 placeholder:dark:text-gray-300 outline-none dark:bg-darkContainerPrimary pl-1 pr-3"
                    />
                </div>

                {customButton}
            </div>

            <div className="h-full w-full flex justify-between place-items-center gap-3 relative overflow-y-auto flex-col">
                <RenderCase renderIf={!page || page.length === 0}>
                    <div className="w-full h-full px-4 flex justify-center place-items-center">
                        <RenderCase renderIf={!tableData}>
                            <LoadingUI />
                        </RenderCase>

                        <RenderCase renderIf={tableData?.length === 0 && currentPage !== 0}>
                            {customNoData || "Không có dữ liệu phù hợp"}
                        </RenderCase>

                        <RenderCase renderIf={currentPage === 0}>
                            {"Vui lòng nhập trang muốn đến"}
                        </RenderCase>
                    </div>
                </RenderCase>

                <RenderCase renderIf={page && page.length > 0}>
                    <div className="max-h-full h-full max-w-full overflow-scroll no-scrollbar w-full">
                        <table {...getTableProps()} className="max-h-full h-full overflow-y-scroll no-scrollbar w-full">
                            <thead className="sticky top-0 z-10 w-full bg-lightContainer dark:bg-darkContainer">
                                {headerGroups.map((headerGroup, headerGroupIndex) => {
                                    const { key, ...headerProps } = headerGroup.getHeaderGroupProps();

                                    return (
                                        <React.Fragment key={`header-group-${key}`}>
                                            <tr {...headerProps} key={`header-row-${headerGroupIndex}`} className="w-full">
                                                <RenderCase renderIf={selectType !== 'none'}>
                                                    <th className="px-4 flex">
                                                        <RenderCase renderIf={selectType === 'multi'}>
                                                            <Checkbox
                                                                isSelected={page.every(row => selectedRows.some(selectedRow => selectedRow[primaryKey] === row.original[primaryKey]))}
                                                                onChange={toggleSelectAll}
                                                            />
                                                        </RenderCase>
                                                    </th>
                                                </RenderCase>

                                                {headerGroup.headers.map((column) => {
                                                    const { key, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());

                                                    return (
                                                        <th {...columnProps} key={`column-${key}`}>
                                                            <div className={`text-xs font-bold tracking-wide text-gray-600 lg:text-xs whitespace-nowrap pb-2 pr-6 text-start mt-[0.5px] 
                                ${column.Header && renderHeader ? renderHeader(column.Header.toString() ?? "") : ""}`}>
                                                                {column.Header?.toString()}
                                                            </div>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                            <div className="h-[0.5px] w-full absolute bottom-0 bg-gray-200 dark:bg-white/10" />
                                        </React.Fragment>
                                    );
                                })}
                            </thead>

                            <tbody {...getTableBodyProps()}>
                                {(page || []).map((row, index) => {
                                    prepareRow(row);
                                    const isSelected = isRowSelected(row.original);

                                    return (
                                        <tr {...row.getRowProps()} key={index} onClick={() => RowClickHandler(row.original)}
                                            className={`
                                            ${onRowClick ? "hover:bg-gray-200 hover:dark:bg-darkContainerPrimary" : ""}
                                            ${index === 0 ? "" : "border-t-[0.5px] border-gray-200 dark:border-white/10"}
                                            ${isSelected ? "bg-gray-200 dark:bg-darkContainerPrimary" : ""}`}
                                        >
                                            <RenderCase renderIf={selectType !== 'none'}>
                                                <td className="pt-[14px] pb-[16px] sm:text-[14px] px-4">
                                                    <Checkbox className="z-0" isSelected={isSelected} onClick={(e) => toggleRowSelection(row.original, e)} />
                                                </td>
                                            </RenderCase>

                                            {row.cells.map((cell) => {
                                                const { key, ...cellProps } = cell.getCellProps();
                                                return (
                                                    <td {...cellProps} key={key} className="pt-[14px] pb-[16px] sm:text-[14px] pr-6">
                                                        <p className="h-full w-full">
                                                            {(renderCell && cell.column.Header ? renderCell(cell.column.Header?.toString(), cell.value, row.original, index, isSelected) : null) || cell.value || <FormattedMessage id="Table.Nodata" />}
                                                        </p>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </RenderCase>

                <div className={`w-full flex place-items-center ${setPageSize ? "justify-between" : " justify-center"}`}>
                    <div className="gap-2 justify-center place-items-center flex h-10 bg-lightPrimary dark:bg-darkContainerPrimary rounded-full px-1">
                        <button className={`flex items-center text-md hover:cursor-pointer bg-lightContainer p-1 text-navy-800 dark:text-white border h-8 w-8
                        border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-darkContainer dark:hover:bg-white/20 dark:active:bg-white/10
                        linear justify-center rounded-full font-bold transition duration-200`}
                            onClick={previousClick} disabled={(!isPaginated || selectType === 'none') && !canPreviousPage}>
                            <MdNavigateBefore className="w-8 h-8" />
                        </button>

                        <input
                            type="string"
                            value={currentPage}
                            onChange={handlePageInputChange}
                            className="w-16 h-8 text-center focus:outline-none font-semibold dark:bg-darkContainerPrimary bg-lightPrimary dark:text-white flex items-center rounded-full"
                        />

                        <button className={`flex items-center text-md hover:cursor-pointer bg-lightContainer p-1 text-navy-800 dark:text-white border h-8 w-8
                        border-gray-200 dark:!border-none hover:bg-gray-100 dark:bg-darkContainer dark:hover:bg-white/20 dark:active:bg-white/10
                        linear justify-center rounded-full font-bold transition duration-200`}
                            onClick={nextClick} disabled={(!isPaginated || selectType === 'none') && !canNextPage}
                        >
                            <MdNavigateNext className="w-8 h-8" />
                        </button>
                    </div>

                    <RenderCase renderIf={!!setPageSize}>
                        <Dropdown
                            animation="transition-all duration-300 ease-in-out"
                            dropdownPosition="top"
                            button={
                                <button className={`col-span-1 w-full lg:w-fit flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 hover:bg-gray-100 dark:bg-[#3A3B3C] dark:hover:bg-white/20 dark:active:bg-white/10
                                    linear justify-center rounded-lg font-medium dark:font-base transition duration-200`}>
                                    {"Hiển thị"} {currentSize}
                                </button>
                            }
                        >
                            <Card className="flex !z-50 flex-col justify-start border dark:border-white/10 !rounded-md dark:text-white dark:shadow-none">
                                {(sizeOptions || []).map((option, index) => (
                                    <div key={option}>
                                        <button
                                            onClick={() => ChangeCurrentSize(option)}
                                            className={`text-sm font-medium text-navy-700 dark:text-white place-items-center
                                            hover:bg-gray-100 dark:hover:bg-gray-800 py-1 px-3 flex justify-between w-full
                                            ${index === 0 ? 'rounded-t-md' : ''}
                                            ${index === (sizeOptions?.length || 0) - 1 ? 'rounded-b-md' : ''}`}
                                        >
                                            {option}

                                            <RenderCase renderIf={option === currentSize}>
                                                <MdRadioButtonChecked />
                                            </RenderCase>

                                            <RenderCase renderIf={option !== currentSize}>
                                                <MdRadioButtonUnchecked />
                                            </RenderCase>
                                        </button>

                                        {index < (sizeOptions?.length || 0) - 1 && (
                                            <div className="h-[0.5px] w-full bg-gray-200 dark:bg-white/10" />
                                        )}
                                    </div>
                                ))}
                            </Card>
                        </Dropdown>
                    </RenderCase>
                </div>
            </div>
        </Card>
    );
};

export default CheckTableV1;