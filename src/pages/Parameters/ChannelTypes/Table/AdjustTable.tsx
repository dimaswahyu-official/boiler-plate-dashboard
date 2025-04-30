import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  branch?: string; // Added branch as an optional property
  create_on: string;
};

type MenuTableProps = {
  data: User[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: User) => void;
};

const MenuTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const { canUpdate, canDelete } = usePagePermissions();

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "role",
        header: "Roles",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "create_on",
        header: "Create On",
        cell: (info) => String(info.getValue()),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="space-x-4">
            {canUpdate && (
              <button
                className="text-blue-600"
                onClick={() => onEdit?.(row.original)}
              >
                <FaEdit />
              </button>
            )}

            {canDelete && (
              <button
                className="text-red-600"
                onClick={() => onDelete(row.original.id)}
              >
                <FaTrash />
              </button>
            )}

            <button
              className="text-green-600"
              onClick={() => onDetail(row.original.id)}
            >
              <FaEye />
            </button>
          </div>
        ),
      },
    ],
    [onDelete, onDetail]
  );

  return (
    <TableComponent
      data={data}
      columns={columns}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      onDetail={onDetail}
    />
  );
};

export default MenuTable;
