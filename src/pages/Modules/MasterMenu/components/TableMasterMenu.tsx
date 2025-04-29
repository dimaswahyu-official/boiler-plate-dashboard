import React, { useMemo, useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaFileImport, FaEye } from "react-icons/fa";
import Input from "../../../../components/form/input/InputField";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import { useNavigate } from "react-router-dom";
import { Row, CellContext, Table } from "@tanstack/react-table";
import { useMenuStore } from "../../../../API/store/menuStore";
import TableComponent from "./TableComponent";


// import * as FaIcons from "react-icons/fa";
import {
  FaRegFileAlt,
  FaDollarSign,
  FaRegNewspaper,
  FaClipboardList,
  FaRoute,
  FaUserTag,
  FaChartLine,
  FaCreditCard,
} from "react-icons/fa";

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
  const {
    fetchMenus,
    menus,
    getParentMenu,
    parentMenus,
    createMenu,
    deleteMenu,
  } = useMenuStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    getParentMenu();
    fetchMenus();
  }, []);

  const tableData = useMemo(() => {
    return menus
      .map((menu) => ({
        id: menu.id,
        name: menu.name,
        path: menu.path,
        icon: menu.icon,
        parent_id: menu.parent_id,
        order: menu.order,
      }))
      .sort((a, b) => {
        if (a.parent_id === b.parent_id) {
          return a.order - b.order; // Sort by order if parent_id is the same
        }
        return (a.parent_id || 0) - (b.parent_id || 0); // Sort by parent_id, treating null as 0
      });
  }, [menus]);

  const parentMenuOpt = useMemo(() => {
    return parentMenus.map((menu) => ({
      id: menu.id,
      name: menu.name,
    }));
  }, [parentMenus]);

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
        cell: (info: CellContext<Menu, string>) => {
          const parentId = info.getValue();
          // Logika untuk menentukan nilai yang akan ditampilkan
          let displayValue;
          if (parentId == null) {
            displayValue = "Menu Header";
          } else if (parentId == "2") {
            displayValue = "Master";
          } else if (parentId == "5") {
            displayValue = "Report";
          } else {
            displayValue = parentId; // Jika tidak ada kondisi yang cocok, tampilkan nilai asli
          }
          return displayValue;
        },
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
              onClick={() => handleDeleteMenu(row.original.id)}
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
    []
  );

  const iconOptions = [
    { value: "FaRegFileAlt", label: "Master Data", icon: <FaRegFileAlt /> },
    { value: "FaDollarSign", label: "Bank Account", icon: <FaDollarSign /> },
    { value: "FaClipboardList", label: "Report", icon: <FaClipboardList /> },
    { value: "FaRoute", label: "Route", icon: <FaRoute /> },
    { value: "FaUserTag", label: "Sales & Distribution", icon: <FaUserTag /> },
    { value: "FaChartLine", label: "Target Sales", icon: <FaChartLine /> },
    { value: "FaRegNewspaper", label: "News", icon: <FaRegNewspaper /> },
    { value: "FaCreditCard", label: "Credit Limit", icon: <FaCreditCard /> },
  ];

  const formFields = [
    {
      name: "name",
      label: "Menu Name",
      type: "text",
      validation: { required: "Menu Name is required" },
    },
    {
      name: "path",
      label: "Path",
      type: "text",
      validation: { required: "Path is required" },
    },
    {
      name: "icon",
      label: "Icon",
      type: "select",
      options: iconOptions.map((option) => ({
        value: option.value,
        label: (
          <div key={option.value} className="flex items-center space-x-1">
            {option.icon}
            <span>{option.label}</span>
          </div>
        ),
      })),
      styles: {
        menu: (provided: any) => ({
          ...provided,
          maxHeight: "100px",
          overflowY: "auto",
        }),
      },
    },
    {
      name: "parent_id",
      label: "Parent",
      type: "select",
      options: [
        { value: 0, label: "Tidak Ada" },
        ...parentMenuOpt.map((menu) => ({
          value: menu.id,
          label: menu.name,
        })),
      ],
      validation: { required: "Parent is required" },
    },
    {
      name: "order",
      label: "Order",
      type: "text",
      validation: { required: "Order is required" },
    },
  ];

  function handleDetail(id: number): void {
    navigate(`/detail_user`, { state: { userId: id } });
  }

  const handleSubmitCreateMenu = async (data: any) => {
    try {
      // Sanitize data to ensure order and parent_id are numbers
      const sanitizedData = {
        name: data.name,
        path: data.path,
        order: Number(data.order), // Ensure order is a number
        icon: data.icon.value, // Assuming icon is an object with a value property
        parent_id: data.parent_id.value ? Number(data.parent_id.value) : null, // Ensure parent_id is a number or null
      };

      await createMenu(sanitizedData); // <- post sanitized data to API via Zustand
      fetchMenus(); // <- refresh data
      handleCloseModal(); // <- close modal
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    console.log("Deleting menu with ID:", id);

    try {
      await deleteMenu(id); // <- delete menu by id
      // showSuccessToast("Menu deleted successfully"); // <- show success toast
      fetchMenus(); // <- refresh data
    } catch (error) {
      console.error("Error deleting menu:", error);
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
