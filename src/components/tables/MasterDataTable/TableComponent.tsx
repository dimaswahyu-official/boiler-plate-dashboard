import React, { useState } from "react";
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
    pageSize: 20,
  });

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      columnVisibility: {
        select: enableSelection,
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
      <div className="overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="sticky top-0 bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-left">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 border-b cursor-pointer"
                      style={{ textAlign: "left" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getIsSorted() === "asc" && " 🔼"}
                      {header.column.getIsSorted() === "desc" && " 🔽"}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
