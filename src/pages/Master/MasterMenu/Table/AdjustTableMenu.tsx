import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";

type Menu = {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  order: number;
};

type MenuTableProps = {
  data: Menu[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: Menu) => void;
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

  const columns: ColumnDef<Menu>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "path",
        header: "Path",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "icon",
        header: "Icon",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "parent_id",
        header: "Parent Id",
        cell: (info) => {
          const val = info.getValue() as number | null;
          return val == null
            ? "Menu Header"
            : val === 2
            ? "Master"
            : val === 5
            ? "Report"
            : val;
        },
      },
      {
        accessorKey: "order",
        header: "Order",
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

            {/* <button
              className="text-green-600"
              onClick={() => onDetail(row.original.id)}
            >
              <FaEye />
            </button> */}
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
