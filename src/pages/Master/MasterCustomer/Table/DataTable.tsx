import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

const DataTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page: number) => {
    console.log("Fetching data for page:", page);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://10.0.29.47/api/v1/customer?page=${page}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiData = response.data.data;
      console.log("API Data:", apiData);

      setData(apiData.data);
      setTotalPages(apiData.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "channel",
      header: "Channel",
    },
    {
      accessorKey: "customer_number",
      header: "Customer Number",
    },
    {
      accessorKey: "organization_name",
      header: "Organization",
    },
    {
      accessorKey: "term_name",
      header: "Term",
    },
    {
      accessorKey: "price_list_name",
      header: "Price List",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Jumlah maksimal halaman yang terlihat
    const startPage = Math.max(2, page - 1); // Halaman sebelum halaman aktif
    const endPage = Math.min(totalPages - 1, page + 1); // Halaman setelah halaman aktif

    // Tambahkan halaman pertama
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

    // Tambahkan "..." jika ada gap antara halaman pertama dan halaman aktif
    if (startPage > 2) {
      pages.push(
        <span key="start-ellipsis" className="px-2 py-1">
          ...
        </span>
      );
    }

    // Tambahkan halaman aktif dan sekitarnya
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-2 py-1 border rounded ${
            page === i ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i}
        </button>
      );
    }

    // Tambahkan "..." jika ada gap antara halaman terakhir dan halaman aktif
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="end-ellipsis" className="px-2 py-1">
          ...
        </span>
      );
    }

    // Tambahkan halaman terakhir
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
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Customer Data Table</h1>
      <div className="overflow-x-auto">
        <div className="overflow-auto max-h-[500px] border border-gray-300">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border border-gray-300 text-left"
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
              {table.getRowModel().rows.map((row: any) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell: any) => (
                <td
                  key={cell.id}
                  className="px-4 py-2 border border-gray-300"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <div className="flex space-x-2">{renderPageNumbers()}</div>
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