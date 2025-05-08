import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";
import Checkbox from "../../../../components/form/input/Checkbox";

type Region = {
  region_code: string;
  region_name: string;
  last_update_date: string;
};

type MenuTableProps = {
  data: Region[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: Region) => void;
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
        accessorKey: "region_code",
        header: "Region Code",
        sortingFn: "basic",
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "region_name",
        header: "Region Name",
        enableSorting: true, // Menambahkan fitur sortir
      },
      {
        accessorKey: "last_update_date",
        header: "Last Update Date",
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
