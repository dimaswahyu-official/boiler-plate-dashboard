import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";
import Checkbox from "../../../../components/form/input/Checkbox";

type Branch = {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  order: number;
};

type MenuTableProps = {
  data: Branch[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: Branch) => void;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "org_id",
      header: "Org ID",
    },
    {
      accessorKey: "organization_code",
      header: "Org Code",
    },
    {
      accessorKey: "organization_name",
      header: "Org Name",
    },
    {
      accessorKey: "region_code",
      header: "Region Code",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "is_active",
      header: "Is Active",
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ getValue }) =>
        new Date(getValue() as string | number | Date).toLocaleDateString(
          "en-US"
        ),
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ getValue }) =>
        new Date(getValue() as string | number | Date).toLocaleDateString(
          "en-US"
        ),
    },
  ];

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
