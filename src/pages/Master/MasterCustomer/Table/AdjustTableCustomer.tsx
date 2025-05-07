import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import TableComponent from "../../../../components/tables/MasterCustomerTable/TableComponent";

type Address = {
  id: number;
  customer_id: number;
  address1: string;
  provinsi: string;
  kab_kodya: string;
  kecamatan: string;
  kelurahan: string | null;
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

type CustomerTableProps = {
  data: Customer[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onDetail: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void; // Tambahkan setPageSize
  totalDataCount: number; // Tambahkan totalDataCount
  isLoading: boolean;
  error: string | null;
};

const AdjustTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  onDetail,
  onDelete,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalDataCount,
  isLoading,
  error,
}: CustomerTableProps) => {
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
            onClick={() => onDetail(row.original.id)}
          >
            Detail
          </button>
        ),
      },
    ],
    [onDetail]
  );

  // console.log("AdjustTableCustomer - currentPage:", currentPage);
  // console.log("AdjustTableCustomer - pageSize:", pageSize);

  return (
    <TableComponent
      data={data}
      columns={columns}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      onDetail={onDetail}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      pageSize={pageSize}
      setPageSize={setPageSize} // Teruskan setPageSize
      totalDataCount={totalDataCount} // Teruskan totalDataCount
      isLoading={isLoading}
      error={error}
    />
  );
};

export default AdjustTable;
