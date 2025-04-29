import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  Table as ReactTable,
  Row,
} from "@tanstack/react-table";
import PaginationControls from "./Pagination";

interface TableComponentProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  enableSelection?: boolean;
}

const TableComponent = <T extends { id: number }>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  enableSelection = true,
}: TableComponentProps<T>) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      columnVisibility: {
        select: enableSelection, // ✅ toggle visibility by ID
      },
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: enableSelection,
  });

  return (
    <>
      <table className="min-w-full table-auto border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100 text-left">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 border-b">
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
            <tr key={row.id} className="hover:bg-gray-50">
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
        pageIndex={table.getState().pagination.pageIndex}
        pageSize={table.getState().pagination.pageSize}
        pageCount={table.getPageCount()}
        setPageSize={(size) =>
          setPagination((prev) => ({ ...prev, pageSize: size }))
        }
        previousPage={table.previousPage}
        nextPage={table.nextPage}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        selectedRowCount={table.getSelectedRowModel().rows.length}
        totalDataCount={data.length}
        gotoPage={(page: number) =>
          setPagination((prev) => ({ ...prev, pageIndex: page }))
        }
      />
    </>
  );
};

export default TableComponent;
