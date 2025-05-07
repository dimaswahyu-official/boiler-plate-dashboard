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
            const response = await axios.get(`http://10.0.29.47/api/v1/branch?sortBy=org_id&sortOrder=asc`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const apiData = response.data.data;
            console.log("API Data:", apiData);

            setData(apiData);
            setTotalPages(1); // Sesuaikan jika API mendukung pagination
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "org_id",
            header: "Org ID",
        },
        {
            accessorKey: "organization_code",
            header: "Org Code",
        },
        {
            accessorKey: "organization_name",
            header: "Org Name",
        },
        {
            accessorKey: "region_code",
            header: "Region Code",
        },
        {
            accessorKey: "address",
            header: "Address",
        },
        {
            accessorKey: "is_active",
            header: "Is Active",
            cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ getValue }) =>
                new Date(getValue()).toLocaleDateString("en-US"),
        },
        {
            accessorKey: "updated_at",
            header: "Updated At",
            cell: ({ getValue }) =>
                new Date(getValue()).toLocaleDateString("en-US"),
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

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Branch Data Table</h1>
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
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page}</span>
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
