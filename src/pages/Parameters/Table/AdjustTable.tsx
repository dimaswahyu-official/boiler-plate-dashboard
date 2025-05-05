import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../utils/UserPagePermissions";

type Channel = {
  id: number;
  key: string;
  value: string;
  label: string;
  is_active: boolean;
  is_admin: boolean;
  created_by: string;
  created_on: string;
  updated_on: string;
  order: number;
};

type MenuTableProps = {
  data: Channel[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: Channel) => void;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const { canUpdate } = usePagePermissions();

  const columns: ColumnDef<Channel>[] = useMemo(
    () => [
      {
        accessorKey: "value",
        header: "Value",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "label",
        header: "Label",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "order",
        header: "Order",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "created_on",
        header: "Created on",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "updated_on",
        header: "Updated on",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            
            {canUpdate && (
              <button
                style={{ color: "blue" }}
                onClick={() => onEdit && onEdit(row.original)}
              >
                <FaEdit />
              </button>
            )}
         
            <button
              style={{ color: "red" }}
              onClick={() => onDelete(row.original.id)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [onDelete, onDetail, onEdit]
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

export default AdjustTable;
