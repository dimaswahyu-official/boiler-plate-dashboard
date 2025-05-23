import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";


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

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "org_id",
        header: "Organization ID",
        sortingFn: "basic",
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "organization_code",
        header: "Organization Code",
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "organization_name",
        header: "Organization Name",
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "region_code",
        header: "Region Code",
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "address",
        header: "Address",
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "is_active",
        header: "Is Active",
        cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
        enableSorting: true, // Menambahkan fitur sortir
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
