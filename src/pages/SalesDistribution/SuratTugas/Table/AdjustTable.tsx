import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import Checkbox from "../../../../components/form/input/Checkbox";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";

type SuratTugas = {
  id: number;
  id_route?: string;
  id_salesman: string;
  salesman_name: string;
  branch?: string;
  route: string;
};

type MenuTableProps = {
  data: SuratTugas[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: SuratTugas) => void;
};

const MenuTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  //   const { canUpdate, canDelete } = usePagePermissions();

  const columns: ColumnDef<SuratTugas>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            label=""
            checked={table.getIsAllRowsSelected()}
            onChange={(checked) => table.toggleAllRowsSelected(checked)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            label=""
            checked={row.getIsSelected()}
            onChange={(checked) => row.toggleSelected(checked)}
          />
        ),
      },
      {
        accessorKey: "id_route",
        header: "ID Route",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "id_salesman",
        header: "ID Salesman",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "salesman_name",
        header: "Name Sales",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "route",
        header: "Route",
        cell: (info) => String(info.getValue()),
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
