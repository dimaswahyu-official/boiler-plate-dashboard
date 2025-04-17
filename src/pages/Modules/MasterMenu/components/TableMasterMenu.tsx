import React, { useMemo, useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaFileImport, FaEye } from 'react-icons/fa';
import Input from "../../../../components/form/input/InputField";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import { useNavigate } from "react-router-dom";
import { Row, CellContext, Table } from "@tanstack/react-table";
import { useMenuStore } from '../../../../API/store/masterMenuStore';
import TableComponent from './TableComponent';

// Define the type for the data
interface Menu {
    id: number;
    name: string;
    path: string;
    icon: string;
    parent_id: number | null;
    order: number;
}

const TableMasterMenu = () => {
    const navigate = useNavigate();
    const { fetchMenus, menus, createMenu } = useMenuStore();
    const [globalFilter, setGlobalFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenModal = () => setIsModalOpen(true);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const tableData = useMemo(() => {
        return menus.map((menu) => ({
            id: menu.id,
            name: menu.name,
            path: menu.path,
            icon: menu.icon,
            parent_id: menu.parent_id,
            order: menu.order,
        }));
    }, [menus]);

    const columns = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }: { table: Table<Menu> }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                        className="w-4 h-4"
                    />
                ),
                cell: ({ row }: { row: Row<Menu> }) => (
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
                cell: (info: CellContext<Menu, string>) => info.getValue(),
            },
            {
                accessorKey: "path",
                header: "Path",
                cell: (info: CellContext<Menu, string>) => info.getValue(),
            },
            {
                id: "iconColumn",
                accessorKey: "icon",
                header: "Icon",
                cell: (info: CellContext<Menu, string>) => info.getValue(),
            },
            {
                id: "parentIdColumn",
                accessorKey: "parent_id",
                header: "Parent Id",
                cell: (info: CellContext<Menu, string>) => info.getValue(),
            },
            {
                accessorKey: "order",
                header: "Order",
                cell: (info: CellContext<Menu, string>) => info.getValue(),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: Row<Menu> }) => (
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

                        <button
                            className="text-green-600 hover:underline"
                            onClick={() => handleDetail(row.original.id)}
                        >
                            <FaEye />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const formFields = [
        { name: "name", label: "Menu Name", type: "text", validation: { required: "Menu Name is required" } },
        { name: "path", label: "Path", type: "text", validation: { required: "Path is required" } },
        { name: "icon", label: "Icon", type: "text" },
        { name: "parent_id", label: "Parent Id", type: "number", validation: { required: "Parent Id is required" } },
        { name: "order", label: "Order", type: "text", validation: { required: "Order is required" } },
    ];

    function handleDetail(id: number): void {
        navigate(`/detail_user`, { state: { userId: id } });
    }

    const handleSubmitCreateMenu = async (data: any) => {
        try {
            await createMenu(data);       // <- post to API via Zustand
            fetchMenus();                 // <- refresh data
            handleCloseModal();           // <- close modal
            console.log("Menu created successfully:", data);
        } catch (error) {
            console.error("Error creating menu:", error);
        }
    };

    return (
        <>
            <div className="p-4 bg-white shadow rounded-md mb-5">
                <div className="flex justify-between items-center mb-4">
                    <div className="space-x-4 flex items-center">
                        <Input
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            type="text"
                            id="input"
                            placeholder="🔍 Search..."
                        />
                    </div>

                    <div className="space-x-4">
                        <ReusableFormModal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onSubmit={handleSubmitCreateMenu}
                            formFields={formFields}
                            title="Create Menu"
                            triggerButtonLabel="Add Menu"
                            triggerButtonIcon={<FaPlus className="mr-2" />}
                            triggerButtonAction={handleOpenModal}
                        />
                    </div>

                </div>
            </div>

            {/* TABLE */}
            <TableComponent
                data={tableData}
                columns={columns}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onDetail={handleDetail}
                enableSelection={false}
            />


        </>

    );
};


export default TableMasterMenu;



