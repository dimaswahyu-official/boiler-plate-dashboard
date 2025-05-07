import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import PaginationControls from "./Pagination";

interface TableComponentProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void; // Tambahkan setPageSize
  totalDataCount: number; // Tambahkan totalDataCount
  isLoading: boolean;
  error: string | null;
}

const TableComponent = <T extends { id: number }>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  onDetail,
  isLoading,
  error,
}: TableComponentProps<T>) => {
  const table = useReactTable<T>({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full table-auto border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100 text-left">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border-b"
                  style={{ textAlign: "left" }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50"
              style={{ textAlign: "left" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={table.getPageCount()}
        setPageSize={table.setPageSize}
        previousPage={table.previousPage}
        nextPage={table.nextPage}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        selectedRowCount={data.length}
        totalDataCount={data.length}
        gotoPage={table.setPageIndex}
      />
    </>
  );
};

export default TableComponent;
