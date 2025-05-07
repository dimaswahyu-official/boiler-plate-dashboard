import React, { useEffect, useState } from "react";
import { useCustomerStore } from "../../../../API/store/MasterStore/masterCustomerStore";
import AdjustTable from "./AdjustTableCustomer";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";

const ViewMasterCustomer = () => {
  const {
    customers,
    isLoading,
    error,
    fetchCustomers,
    totalCount, // ✅ tambahkan ini
  } = useCustomerStore();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  useEffect(() => {
    console.log("currentPage:", currentPage);

    console.log(
      "Fetching data for page:",
      currentPage + 1,
      "with pageSize:",
      pageSize
    );
    fetchCustomers(currentPage + 1, pageSize); // ✅ lebih clean
  }, [currentPage, pageSize, fetchCustomers]);

  const handleDetail = (id: number) => {
    console.log("Detail ID:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete ID:", id);
  };

  return (
    <div>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Label htmlFor="search">Pencarian</Label>
            <Input
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="text"
              id="search"
              placeholder="🔍 Search..."
            />
          </div>

          <div className="space-x-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Unduh Data")}
            >
              Unduh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Import Data")}
            >
              Import
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Tambah Customer")}
            >
              Tambah Customer
            </Button>
          </div>
        </div>
      </div>

      <AdjustTable
        data={customers}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={(size) => setPageSize(size)} // ✅
        totalDataCount={customers.length} // ❗️
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default ViewMasterCustomer;
