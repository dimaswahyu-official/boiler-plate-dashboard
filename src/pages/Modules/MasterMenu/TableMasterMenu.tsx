import React, { useMemo, useState } from "react";
import { FaTrash, FaPlus, FaEdit, FaFileImport } from 'react-icons/fa';
import Button from "../../../components/ui/button/Button";
import DatePicker from "../../../components/form/date-picker";
import Input from "../../../components/form/input/InputField";
import DialogWithForm from '../../../components/modal';

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    Row,
    CellContext,
    Table,
    getSortedRowModel,
} from "@tanstack/react-table";

// Define the type for the data
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Dummy data
const dummyData: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice@domain.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@domain.com", role: "User" },
    { id: 3, name: "Charlie Brown", email: "charlie@domain.com", role: "Editor" },
    { id: 4, name: "Diana Prince", email: "diana@domain.com", role: "Moderator" },
    { id: 5, name: "Evan Davis", email: "evan@domain.com", role: "User" },
    { id: 6, name: "Fiona Gallagher", email: "fiona@domain.com", role: "Admin" },
    { id: 7, name: "George Michael", email: "george@domain.com", role: "User" },
    { id: 8, name: "Hannah Baker", email: "hannah@domain.com", role: "User" },
    { id: 9, name: "Ian Curtis", email: "ian@domain.com", role: "Editor" },
    { id: 10, name: "Jane Doe", email: "jane@domain.com", role: "User" },
    { id: 11, name: "Kevin Hart", email: "kevin@domain.com", role: "Moderator" },
    { id: 12, name: "Laura Palmer", email: "laura@domain.com", role: "Admin" },
    { id: 13, name: "Michael Scott", email: "michael@domain.com", role: "User" },
    { id: 14, name: "Nancy Drew", email: "nancy@domain.com", role: "Editor" },
    { id: 15, name: "Oscar Wilde", email: "oscar@domain.com", role: "User" },
    { id: 16, name: "Pam Beesly", email: "pam@domain.com", role: "Moderator" },
    { id: 17, name: "Quincy Adams", email: "quincy@domain.com", role: "User" },
    { id: 18, name: "Rachel Green", email: "rachel@domain.com", role: "Admin" },
    { id: 19, name: "Steve Rogers", email: "steve@domain.com", role: "User" },
    { id: 20, name: "Tina Fey", email: "tina@domain.com", role: "Editor" },
    { id: 21, name: "Uma Thurman", email: "uma@domain.com", role: "User" },
    { id: 22, name: "Victor Hugo", email: "victor@domain.com", role: "Moderator" },
    { id: 23, name: "Wanda Maximoff", email: "wanda@domain.com", role: "Admin" },
    { id: 24, name: "Xander Cage", email: "xander@domain.com", role: "User" },
    { id: 25, name: "Yvonne Strahovski", email: "yvonne@domain.com", role: "Editor" },
    { id: 26, name: "Zachary Levi", email: "zachary@domain.com", role: "User" },
    { id: 27, name: "Amy Santiago", email: "amy@domain.com", role: "Moderator" },
    { id: 28, name: "Jake Peralta", email: "jake@domain.com", role: "User" },
    { id: 29, name: "Rosa Diaz", email: "rosa@domain.com", role: "Admin" },
    { id: 30, name: "Terry Jeffords", email: "terry@domain.com", role: "User" },
];

const TableMasterUser = () => {
    const [globalFilter, setGlobalFilter] = useState("");

    const columns = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }: { table: Table<User> }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                        className="w-4 h-4"
                    />
                ),
                cell: ({ row }: { row: Row<User> }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                        className="w-4 h-4"
                    />
                ),
            },
            {
                accessorKey: "name",
                header: ({ column }: { column: any }) => (
                    <div className="flex items-center space-x-2">
                        <span>Name</span>
                        <button
                            onClick={column.getToggleSortingHandler()}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {column.getIsSorted() === "asc" ? "🔼" : column.getIsSorted() === "desc" ? "🔽" : "↕"}
                        </button>
                    </div>
                ),
                cell: (info: CellContext<User, string>) => info.getValue(),
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: (info: CellContext<User, string>) => info.getValue(),
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: (info: CellContext<User, string>) => info.getValue(),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: Row<User> }) => (
                    <div className="space-x-4">
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => alert(`Edit ${row.original.name}`)}
                        >
                            <FaEdit />
                        </button>

                        <button
                            className="text-red-600 hover:underline"
                            onClick={() => alert(`Delete ${row.original.name}`)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const table = useReactTable<User>({
        data: dummyData,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableRowSelection: true,
    });

    return (
        <>
            <div className="p-4 bg-white shadow rounded-md mb-5">
                <div className="flex justify-between items-center mb-4">
                    <div className="space-x-4 flex items-center">

                        <Input
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            type="text"
                            id="input"
                            placeholder="🔍 Search users..."
                        />

                        <DatePicker
                            id="date-picker"
                            placeholder="Select a date"
                            onChange={(dates, currentDateString) => {
                                console.log({ dates, currentDateString });
                            }}
                        />
                    </div>

                    <div className="space-x-4">
                        <DialogWithForm />  
                        
                        <Button variant="primary" size="sm" onClick={() => alert("Add User")}>
                            <FaFileImport className="mr-2" /> Import User
                        </Button>
                    </div>

                </div>
            </div>

            <div className="p-4 bg-white shadow rounded-md">
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

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>

                    <div className="space-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default TableMasterUser;
