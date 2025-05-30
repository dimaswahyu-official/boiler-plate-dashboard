import React, { useEffect, useState } from "react";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import DataTable from "../Table/DataTable";
import { useDebounce } from "../../../../helper/useDebounce";

const ViewMasterCustomer = () => {
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedGlobalFilter = useDebounce(globalFilter, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedGlobalFilter]);

  const options = [{ value: "A", label: "Active" }];
  return (
    <div>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Label htmlFor="search">Nama/ID Pelanggan</Label>
            <Input
              onChange={(e) => {
                setGlobalFilter(e.currentTarget.value);
              }}
              type="text"
              id="search"
              placeholder="🔍 Masukan nama/id pelang...."
            />
          </div>

          <div className="space-x-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Unduh Data")}
            >
              <FaFileDownload />
              Unduh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Import Data")}
            >
              <FaFileImport />
              Import
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Tambah Customer")}
            >
              <FaPlus />
              Tambah Customer
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Cabang</Label>
            <Select
              options={options}
              placeholder="Pilih"
              value=""
              className="dark:bg-dark-900 react-select-container"
              onChange={(value) => {
                console.log("Selected Status:", value);
              }}
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Tipe Channel</Label>
            <Select
              options={options}
              placeholder="Pilih"
              value=""
              className="dark:bg-dark-900 react-select-container"
              onChange={(value) => {
                console.log("Selected Status:", value);
              }}
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Status</Label>
            <Select
              options={options}
              placeholder="Pilih"
              value=""
              className="dark:bg-dark-900 react-select-container"
              onChange={(value) => {
                console.log("Selected Status:", value);
              }}
            />
          </div>

          <div className="flex justify-center items-center mt-5">
            <Button
              variant="rounded"
              size="sm"
              onClick={() => alert("Reset Filter")}
            >
              <FaUndo />
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        globalFilter={debouncedGlobalFilter}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default ViewMasterCustomer;
