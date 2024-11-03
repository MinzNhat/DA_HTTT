import {
    UseColumnOrderInstanceProps,
    UseColumnOrderState,
    UseExpandedHooks,
    UseExpandedInstanceProps,
    UseExpandedOptions,
    UseExpandedRowProps,
    UseExpandedState,
    UseFiltersColumnOptions,
    UseFiltersColumnProps,
    UseFiltersInstanceProps,
    UseFiltersOptions,
    UseFiltersState,
    UseGlobalFiltersColumnOptions,
    UseGlobalFiltersInstanceProps,
    UseGlobalFiltersOptions,
    UseGlobalFiltersState,
    UseGroupByCellProps,
    UseGroupByColumnOptions,
    UseGroupByColumnProps,
    UseGroupByHooks,
    UseGroupByInstanceProps,
    UseGroupByOptions,
    UseGroupByRowProps,
    UseGroupByState,
    UsePaginationInstanceProps,
    UsePaginationOptions,
    UsePaginationState,
    UseResizeColumnsColumnOptions,
    UseResizeColumnsColumnProps,
    UseResizeColumnsOptions,
    UseResizeColumnsState,
    UseRowSelectHooks,
    UseRowSelectInstanceProps,
    UseRowSelectOptions,
    UseRowSelectRowProps,
    UseRowSelectState,
    UseRowStateCellProps,
    UseRowStateInstanceProps,
    UseRowStateOptions,
    UseRowStateRowProps,
    UseRowStateState,
    UseSortByColumnOptions,
    UseSortByColumnProps,
    UseSortByHooks,
    UseSortByInstanceProps,
    UseSortByOptions,
    UseSortByState,
    Column
} from "react-table";

declare module "react-table" {

    export interface TableOptions<D extends Record<string, unknown>>
        extends UseExpandedOptions<D>,
        UseFiltersOptions<D>,
        UseGlobalFiltersOptions<D>,
        UseGroupByOptions<D>,
        UsePaginationOptions<D>,
        UseResizeColumnsOptions<D>,
        UseRowSelectOptions<D>,
        UseRowStateOptions<D>,
        UseSortByOptions<D>,
        Record<string, any> { } // eslint-disable-line

    export interface Hooks<
        D extends Record<string, unknown> = Record<string, unknown>
    >
        extends UseExpandedHooks<D>,
        UseGroupByHooks<D>,
        UseRowSelectHooks<D>,
        UseSortByHooks<D> { }

    export interface TableInstance<
        D extends Record<string, unknown> = Record<string, unknown>
    >
        extends UseColumnOrderInstanceProps<D>,
        UseExpandedInstanceProps<D>,
        UseFiltersInstanceProps<D>,
        UseGlobalFiltersInstanceProps<D>,
        UseGroupByInstanceProps<D>,
        UsePaginationInstanceProps<D>,
        UseRowSelectInstanceProps<D>,
        UseRowStateInstanceProps<D>,
        UseSortByInstanceProps<D> { }

    export interface TableState<
        D extends Record<string, unknown> = Record<string, unknown>
    >
        extends UseColumnOrderState<D>,
        UseExpandedState<D>,
        UseFiltersState<D>,
        UseGlobalFiltersState<D>,
        UseGroupByState<D>,
        UsePaginationState<D>,
        UseResizeColumnsState<D>,
        UseRowSelectState<D>,
        UseRowStateState<D>,
        UseSortByState<D> { }

    export interface ColumnInterface<
        D extends Record<string, unknown> = Record<string, unknown>
    >
        extends UseFiltersColumnOptions<D>,
        UseGlobalFiltersColumnOptions<D>,
        UseGroupByColumnOptions<D>,
        UseResizeColumnsColumnOptions<D>,
        UseSortByColumnOptions<D> { }

    export interface ColumnInstance<
        D extends Record<string, unknown> = Record<string, unknown>
    >
        extends UseFiltersColumnProps<D>,
        UseGroupByColumnProps<D>,
        UseResizeColumnsColumnProps<D>,
        UseSortByColumnProps<D> { }

    export interface Cell<
        D extends Record<string, unknown> = Record<string, unknown>,
        V = any // eslint-disable-line
    > extends UseGroupByCellProps<D>, UseRowStateCellProps<D> { }

    export interface Row<
        D extends Record<string, unknown> = Record<string, unknown>
    >
        extends UseExpandedRowProps<D>,
        UseGroupByRowProps<D>,
        UseRowSelectRowProps<D>,
        UseRowStateRowProps<D> { }
};

declare type TableSelectType = 'none' | 'single' | 'multi';

declare type TableData = Record<[key], string | number | boolean>;

declare type SetTableSizeProps = {
    sizeOptions: number[];
    setCurrentSize: React.Dispatch<React.SetStateAction<number>>;
}

type NonPaginatedTableProps<T extends TableData> = {
    isPaginated?: false;
    selectType?: TableSelectType;
    containerClassname?: string;

    fetchPageData: () => void;

    tableData: T[] | undefined;
    columnsData: Column<T>[];
    renderHeader?: (_cellHeader: string) => string;
    renderCell?: (_cellHeader: string, _cellValue: string | number | boolean, _rowValue: T, _cellIndex: number | string, _isRowSelected: boolean) => React.ReactNode | void;

    maxPage?: number;
    currentSize: number;
    currentPage: number;
    setPageSize?: SetTableSizeProps;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

    primaryKey: keyof T;
    selectedRows: T[];
    setSelectedRows: React.Dispatch<React.SetStateAction<T[]>>;

    customButton?: React.ReactNode;
    customNoData?: React.ReactNode;

    onRowClick?: (_value: T) => void;
};

type PaginatedTableProps<T extends TableData> = {
    isPaginated: true;
    selectType?: TableSelectType;
    containerClassname?: string;

    fetchPageData: (_page?: number, _size?: number) => void;

    tableData: T[] | undefined;
    columnsData: Column<T>[];
    renderHeader?: (_cellHeader: string) => string;
    renderCell?: (_cellHeader: string, _cellValue: string | number | boolean, _rowValue: T, _cellIndex: number | string, _isRowSelected: boolean,) => React.ReactNode | void;

    maxPage?: number;
    currentSize: number;
    currentPage: number;
    setPageSize?: SetTableSizeProps;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

    primaryKey: keyof T;
    selectedRows: T[];
    setSelectedRows: React.Dispatch<React.SetStateAction<T[]>>;

    customButton?: React.ReactNode;
    customNoData?: React.ReactNode;

    onRowClick?: (_value: T) => void;
};

declare type TableProps<T extends TableData> = NonPaginatedTableProps<T> | PaginatedTableProps<T>;