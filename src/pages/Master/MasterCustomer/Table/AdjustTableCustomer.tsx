import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterDataTable/TableComponent";
import Checkbox from "../../../../components/form/input/Checkbox";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Address = {
  id: number;
  customer_id: number;
  address1: string;
  provinsi: string;
  kab_kodya: string;
  kecamatan: string;
  kelurahan: string;
  kodepos: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
};

type Customer = {
  id: number;
  name: string;
  alias: string | null;
  owner: string | null;
  phone: string | null;
  npwp: string | null;
  ktp: string | null;
  channel: string;
  customer_number: string;
  addresses: Address[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
};

type MenuTableProps = {
  data: Customer[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (data: Customer) => void;
};

const MenuTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  onEdit,
}: MenuTableProps) => {
  const navigate = useNavigate();

  function detailCustomerPage(custData: Customer) {
    navigate(`/detail_customer`, { state: { custData } });
  }

  const columns: ColumnDef<Customer>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID Pelanggan",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "name",
        header: "Nama Pelanggan",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: (info) => String(info.getValue() || "-"),
      },
      {
        accessorKey: "channel",
        header: "Channel",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "customer_number",
        header: "Customer Number",
        cell: (info) => String(info.getValue()),
      },
      {
        accessorKey: "is_active",
        header: "Active",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <button
            className="text-blue-600"
            onClick={() => {
              const custData = row.original;
              detailCustomerPage(custData);
            }}
          >
            Detail
          </button>
        ),
      },
    ],
    [onDetail]
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
