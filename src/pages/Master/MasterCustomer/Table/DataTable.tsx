import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useCustomerStore } from "../../../../API/store/MasterStore/masterCustomerStore";

interface DataTableProps {
  globalFilter: string; // Tambahkan prop globalFilter
}

const DataTable: React.FC<DataTableProps> = ({ globalFilter }) => {
  const navigate = useNavigate();
  const { customers, totalPages, fetchCustomers } = useCustomerStore();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const sortBy = sorting[0]?.id ?? "customer_number"; // default kolom
    const sortOrder = sorting[0]?.desc ? "desc" : "asc";

    fetchCustomers(page, 50, sortBy, sortOrder, globalFilter);
  }, [page, globalFilter, sorting]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "customer_number",
      header: "ID Pelanggan",
    },
    {
      accessorKey: "name",
      header: "Nama pelanggan",
    },
    {
      accessorKey: "channel",
      header: "Channel",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ getValue }) => (getValue() ? "Aktif" : "Non Aktif"),
    },
    {
      accessorKey: "organization_code",
      header: "Cabang",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <a
          href="#"
          className="text-blue-500 underline"
          onClick={(e) => {
            e.preventDefault();
            handleDetailClick(row.original);
          }}
        >
          Detail
        </a>
      ),
    },
  ];

  const handleDetailClick = (customer: any) => {
    console.log("Customer details:", customer);
    navigate("/detail_customer", { state: { customer } });
  };

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // tetap dibutuhkan walau sorting-nya server-side
    manualSorting: true, // ⬅️ penting agar TanStack tidak melakukan sorting lokal
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  const renderPageNumbers = () => {
    const pages = [];

    // Halaman pertama
    pages.push(
      <button
        key={1}
        onClick={() => setPage(1)}
        className={`px-2 py-1 border rounded ${
          page === 1 ? "bg-blue-500 text-white" : ""
        }`}
      >
        1
      </button>
    );

    // Halaman aktif (current page)
    if (page !== 1 && page !== totalPages) {
      pages.push(
        <button
          key={page}
          className="px-2 py-1 border rounded bg-blue-500 text-white"
          disabled
        >
          {page}
        </button>
      );
    }

    // Halaman terakhir
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className={`px-2 py-1 border rounded ${
            page === totalPages ? "bg-blue-500 text-white" : ""
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="overflow-auto max-h-[500px] border border-gray-300">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup: any) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 border border-gray-300 text-left cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row: any) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 border border-gray-300"
                    >
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
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <div className="flex space-x-2 items-center">{renderPageNumbers()}</div>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
