import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Badge from "../../../../components/ui/badge/Badge";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { useNavigate } from "react-router-dom";

type Role = {
  id: number;
  name: string;
  description: string;
};

type RoleTableProps = {
  data: Role[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: Role) => void;
};

const AdjustTableRole = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
}: RoleTableProps) => {
  const navigate = useNavigate();

  function navigateToUpdateRole(roleData: Role) {
    const { id } = roleData;
    navigate(`/master_role/update`, { state: { id } });
  }

  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string | undefined;
          return (
            <Badge
              variant="solid"
              size="sm"
              color={
                status === "Active"
                  ? "success"
                  : status === "Pending"
                  ? "warning"
                  : "error"
              }
            >
              {status || "No Status"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="space-x-4">
            <button
              className="text-blue-600"
              onClick={() => {
                const roleData = row.original;
                navigateToUpdateRole(roleData);
              }}
            >
              <FaEdit />
            </button>
            <button
              className="text-red-600"
              onClick={() => onDelete(row.original.id)}
            >
              <FaTrash />
            </button>
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

export default AdjustTableRole;
