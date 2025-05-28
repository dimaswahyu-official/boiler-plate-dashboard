import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";

interface Branch {
  id: number;
  organization_code: string;
  organization_name: string;
  organization_id: number;
  org_name: string;
  org_id: string;
  organization_type: string;
  region_code: string;
  address: string;
  location_id: number;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  deleted_at: string | null;
  region_name: string;
}

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
  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "org_id",
        header: "Organization ID",
        sortingFn: "basic",
        enableSorting: true,
      },
      {
        accessorKey: "organization_code",
        header: "Organization Code",
        enableSorting: true,
      },
      {
        accessorKey: "organization_name",
        header: "Organization Name",
        enableSorting: true,
      },
      {
        accessorKey: "region_code",
        header: "Region Code",
        enableSorting: true,
      },
      {
        accessorKey: "address",
        header: "Address",
        enableSorting: true,
      },
      {
        accessorKey: "is_active",
        header: "Is Active",
        cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
        enableSorting: true,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ getValue }) =>
          new Date(getValue() as string | number | Date).toLocaleDateString(
            "en-US"
          ),
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ getValue }) =>
          new Date(getValue() as string | number | Date).toLocaleDateString(
            "en-US"
          ),
        enableSorting: true, // Menambahkan fitur sortir
      },
    ],
    []
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
