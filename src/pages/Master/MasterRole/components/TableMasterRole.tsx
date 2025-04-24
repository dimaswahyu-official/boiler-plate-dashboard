import React, { useMemo, useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaFileImport,
  FaEye,
  FaFileDownload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Row, CellContext, Table } from "@tanstack/react-table";
import { useRoleStore } from "../../../../API/store/roleStore";
import TableComponent from "./TableComponent";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";

// Define the type for the data
interface Menu {
  id: number;
  name: string;
  description: string;
}

const TableMasterRole = () => {
  const navigate = useNavigate();
  const { fetchRole, roles } = useRoleStore();

  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);

  useEffect(() => {
    fetchRole();
  }, []);

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
            <span>Role</span>
            <button
              onClick={column.getToggleSortingHandler()}
              className="text-gray-500 hover:text-gray-700"
            >
              {column.getIsSorted() === "asc"
                ? "🔼"
                : column.getIsSorted() === "desc"
                ? "🔽"
                : "↕"}
            </button>
          </div>
        ),
        cell: (info: CellContext<Menu, string>) => info.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
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

            {/* <button
              className="text-red-600 hover:underline"
              onClick={() => handleDeleteMenu(row.original.id)}
            >
              <FaTrash />
            </button> */}

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
    []
  );

  function handleDetail(id: number): void {
    navigate(`/detail_user`, { state: { userId: id } });
  }

  // const parentMenuOpt = useMemo(() => {
  //   return parentMenus.map((menu) => ({
  //     id: menu.id,
  //     name: menu.name,
  //   }));
  // }, [parentMenus]);

  // const iconOptions = [
  //   { value: "FaRegFileAlt", label: "Master Data", icon: <FaRegFileAlt /> },
  //   { value: "FaDollarSign", label: "Bank Account", icon: <FaDollarSign /> },
  //   { value: "FaClipboardList", label: "Report", icon: <FaClipboardList /> },
  //   { value: "FaRoute", label: "Route", icon: <FaRoute /> },
  //   { value: "FaUserTag", label: "Sales & Distribution", icon: <FaUserTag /> },
  //   { value: "FaChartLine", label: "Target Sales", icon: <FaChartLine /> },
  //   { value: "FaRegNewspaper", label: "News", icon: <FaRegNewspaper /> },
  //   { value: "FaCreditCard", label: "Credit Limit", icon: <FaCreditCard /> },
  // ];

  // const formFields = [
  //   {
  //     name: "name",
  //     label: "Menu Name",
  //     type: "text",
  //     validation: { required: "Menu Name is required" },
  //   },
  //   {
  //     name: "path",
  //     label: "Path",
  //     type: "text",
  //     validation: { required: "Path is required" },
  //   },
  //   {
  //     name: "icon",
  //     label: "Icon",
  //     type: "select",
  //     options: iconOptions.map((option) => ({
  //       value: option.value,
  //       label: (
  //         <div key={option.value} className="flex items-center space-x-1">
  //           {option.icon}
  //           <span>{option.label}</span>
  //         </div>
  //       ),
  //     })),
  //     styles: {
  //       menu: (provided: any) => ({
  //         ...provided,
  //         maxHeight: "100px",
  //         overflowY: "auto",
  //       }),
  //     },
  //   },
  //   {
  //     name: "parent_id",
  //     label: "Parent",
  //     type: "select",
  //     options: [
  //       { value: 0, label: "Tidak Ada" },
  //       ...parentMenuOpt.map((menu) => ({
  //         value: menu.id,
  //         label: menu.name,
  //       })),
  //     ],
  //     validation: { required: "Parent is required" },
  //   },
  //   {
  //     name: "order",
  //     label: "Order",
  //     type: "text",
  //     validation: { required: "Order is required" },
  //   },
  // ];

  // const handleSubmitCreateMenu = async (data: any) => {
  //   try {
  //     // Sanitize data to ensure order and parent_id are numbers
  //     const sanitizedData = {
  //       name: data.name,
  //       path: data.path,
  //       order: Number(data.order), // Ensure order is a number
  //       icon: data.icon.value, // Assuming icon is an object with a value property
  //       parent_id: data.parent_id.value ? Number(data.parent_id.value) : null, // Ensure parent_id is a number or null
  //     };

  //     await createMenu(sanitizedData); // <- post sanitized data to API via Zustand
  //     fetchMenus(); // <- refresh data
  //     handleCloseModal(); // <- close modal
  //   } catch (error) {
  //     console.error("Error creating menu:", error);
  //   }
  // };

  // const handleDeleteMenu = async (id: number) => {
  //   console.log("Deleting menu with ID:", id);

  //   try {
  //     await deleteMenu(id); // <- delete menu by id
  //     // showSuccessToast("Menu deleted successfully"); // <- show success toast
  //     fetchMenus(); // <- refresh data
  //   } catch (error) {
  //     console.error("Error deleting menu:", error);
  //   }
  // };

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
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Add User")}
            >
              <FaFileImport className="mr-2" /> Import
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/create_role")}
            >
              <FaPlus className="mr-2" /> Tambah Role
            </Button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <TableComponent
        data={roles}
        columns={columns}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        enableSelection={false}
      />
    </>
  );
};

export default TableMasterRole;
