import React, { useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import Checkbox from "../../../../components/form/input/Checkbox";

type Branch = {
  id: number;
  employee_name: string;
  salesrep_id: string;
  vendor_name: string;
  organization_name: string;
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
        accessorKey: "employee_name",
        header: "Salesman Name",
        sortingFn: "basic",
        enableSorting: true,
      },
      {
        accessorKey: "salesrep_id",
        header: "salesrep_id",
        sortingFn: "basic",
        enableSorting: true,
      },
      {
        accessorKey: "salesrep_number",
        header: "salesrep_number",
        sortingFn: "basic",
        enableSorting: true,
      },
      {
        accessorKey: "vendor_name",
        header: "Vendor Name",
        sortingFn: "basic",
        enableSorting: true,
      },
      {
        accessorKey: "organization_name",
        header: "Organization Name",
        sortingFn: "basic",
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Status",
        sortingFn: "basic",
        enableSorting: true,
      },
      {
        accessorKey: "start_date_active",
        header: "Started At",
        cell: ({ getValue }) =>
          new Date(getValue() as string | number | Date).toLocaleDateString(
            "en-GB",
            {
              timeZone: "UTC",
            }
          ),
        enableSorting: true,
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
