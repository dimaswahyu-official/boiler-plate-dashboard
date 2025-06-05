import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import Badge from "../../../../components/ui/badge/Badge";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  branch: string;
  region_name: string;
  created_on: string;
  nik: string;
  nik_spv: string;
  is_active: string;
  is_sales: string;
  valid_to: string;
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
        accessorKey: "nik",
        header: "NIK",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "region_name",
        header: "Region",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "is_active",
        header: "Active",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "is_sales",
        header: "Is Sales",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "created_on",
        header: "Created On",
        cell: (info) => String(info.getValue()),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="space-x-4">
            <button onClick={() => onDetail(row.original.id)}>
              <Badge variant="solid" size="sm" color="secondary">
                <FaEye />
                Detail
              </Badge>
            </button>
          </div>
        ),
      },
    ],
    [onDelete, onDetail, canUpdate, canDelete, onEdit]
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
