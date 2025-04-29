import { useEffect, useMemo, useState } from "react";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { useUserStore } from "../../../../API/store/masterUserStore";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaFileImport,
  FaEye,
  FaUndo,
  FaFileDownload,
} from "react-icons/fa";
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
  username: string;
  email: string;
  role: string;
  branch?: string; // Added branch as an optional property
  create_on: string;
}

const TableMasterUser = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fetchAllUser, user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllUser();
    };
    fetchData();
  }, [fetchAllUser]);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDetail = (id: number): void => {
    navigate(`/detail_user`, { state: { userId: id } });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }: { column: any }) => (
          <SortableHeader column={column} label="Name" />
        ),
        cell: (info: CellContext<User, string>) => info.getValue(),
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: (info: CellContext<User, string>) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info: CellContext<User, string>) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Roles",
        cell: (info: CellContext<User, string>) => info.getValue(),
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: (info: CellContext<User, string>) => info.getValue(),
      },
      {
        accessorKey: "create_on",
        header: "Create On",
        cell: (info: CellContext<User, string>) => info.getValue(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<User> }) => (
          <div className="space-x-4">
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
    [handleDetail]
  );

  const mappedUser = useMemo(() => {
    return user.map((u) => ({
      id: u.id,
      name: u.name || "", // Ensure name exists
      username: u.username,
      email: u.email,
      role: u.role || "", // Ensure role exists
      branch: u.branch || "",
      create_on: u.create_on || "", // Ensure create_on exists
    }));
  }, [user]);

  const table = useReactTable<User>({
    data: mappedUser,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const formFields = [
    {
      name: "name",
      label: "Nama",
      type: "text",
      validation: { required: "Name is required" },
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      validation: { required: "Username is required" },
    },
    {
      name: "phone_number",
      label: "No. Handphone Kantor",
      type: "text",
      validation: { required: "Phone number is required" },
    },
    {
      name: "roles",
      label: "Roles",
      type: "select",
      options: [
        { value: "admin", label: "Admin" },
        { value: "spv", label: "SPV" },
        { value: "staff", label: "Staff" },
      ],
      validation: { required: "Role is required" },
    },
    {
      name: "branch",
      label: "Cabang",
      type: "select",
      options: [
        { value: "JAT", label: "JAT" },
        { value: "KDS", label: "KDS" },
        { value: "BDG", label: "BDG" },
      ],
      validation: { required: "Branch is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      validation: { required: "Email is required" },
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 12,
          message: "Password must be at least 12 characters",
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          message: "Password must include uppercase, lowercase, and a number",
        },
      },
    },
  ];

  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <>
      {/* ACTION SECTION */}
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <ActionSection
          setGlobalFilter={setGlobalFilter}
          setIsModalOpen={setIsModalOpen}
          options={options}
          handleSelectChange={handleSelectChange}
        />
        <ReusableFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={(data) => console.log("Form Submitted:", data)}
          formFields={formFields}
          title="Create User"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="p-4 bg-white shadow rounded-md">
        <TableSection table={table} />
      </div>
    </>
  );
};

const SortableHeader = ({ column, label }: { column: any; label: string }) => (
  <div className="flex items-center space-x-2">
    <span>{label}</span>
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
);

const ActionSection = ({
  setGlobalFilter,
  setIsModalOpen,
  options,
  handleSelectChange,
}: {
  setGlobalFilter: (value: string) => void;
  setIsModalOpen: (value: boolean) => void;
  options: { value: string; label: string }[];
  handleSelectChange: (value: string) => void;
}) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <div className="space-x-4 flex items-center">
        <div>
          <Label htmlFor="input">Search User</Label>
          <Input
            onChange={(e) => setGlobalFilter(e.target.value)}
            type="text"
            id="input"
            placeholder="🔍 Search users..."
          />
        </div>
      </div>
      
      <div className="space-x-4">
        <Button
          variant="primary"
          size="sm"
          onClick={() => alert("Download Users")}
        >
          <FaFileDownload className="mr-2" /> Unduh
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => alert("Import Users")}
        >
          <FaFileImport className="mr-2" /> Import User
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Tambah User
        </Button>
      </div>
    </div>

    <div className="flex justify-between items-center mb-4">
      <div className="space-x-4 flex items-center">
        {["Posisi", "Cabang", "Wilayah", "Status"].map((label) => (
          <div key={label}>
            <Label htmlFor={`${label.toLowerCase()}-select`}>{label}</Label>
            <Select
              options={options}
              placeholder={`Pilih ${label}`}
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container mr-5"
            />
          </div>
        ))}
        <div>
          <Label htmlFor="date-picker">Tanggal Dibuat</Label>
          <DatePicker
            id="date-picker"
            placeholder="Select a date"
            onChange={(dates, currentDateString) =>
              console.log({ dates, currentDateString })
            }
          />
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert("Reset Filters")}
          >
            <FaUndo className="mr-2" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const TableSection = ({ table }: { table: any }) => (
  <>
    <table className="min-w-full table-auto border border-gray-200">
      <thead>
        {table.getHeaderGroups().map((headerGroup: any) => (
          <tr key={headerGroup.id} className="bg-gray-100 text-left">
            {headerGroup.headers.map((header: any) => (
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
        {table.getRowModel().rows.map((row: any) => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map((cell: any) => (
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
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
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

  </>
);

export default TableMasterUser;
