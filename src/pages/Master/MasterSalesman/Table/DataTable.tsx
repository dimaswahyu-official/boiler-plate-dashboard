import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import AdjustTable from "./AdjustTable";
import axios from "axios";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import Button from "../../../../components/ui/button/Button";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import Spinner from "../../../../components/ui/spinner";

import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import { useSalesmanStore } from "../../../../API/store/MasterStore/masterSalesmanStore";
import { useDebounce } from "../../../../helper/useDebounce";
import { showErrorToast } from "../../../../components/toast";

interface Option {
  value: string;
  label: string;
}

const DataTable = () => {
  const navigate = useNavigate();

  const { fetchSalesman, salesman, isLoading } = useSalesmanStore();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editMenuData, setEditMenuData] = useState<any | null>(null);
  const debouncedFilter = useDebounce(globalFilter, 500);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedOrgName, setSelectedOrgName] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    startDate: null as string | null,
    endDate: null as string | null,
    organizationName: "",
    status: "",
  });

  const handleDetail = (id: number) => {
    navigate("/detail_user", { state: { userId: id } });
  };

  const handleDelete = async (id: number) => {
    console.log("Delete ID:", id); // Log the ID to be deleted
  };

  const options = [
    { value: "A", label: "Active" },
    { value: "I", label: "Inactive" },
  ];

  const [optOrgName, setOptOrgName] = useState<Option[]>([]);

  const getOrgName = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://10.0.29.47/api/v1/branch?sortBy=org_id&sortOrder=asc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiData = response.data.data;
      const options = apiData.map((item: any) => ({
        value: item.organization_name,
        label: item.organization_name,
      }));
      setOptOrgName(options);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchSalesman();
        await getOrgName();
      } catch (err: any) {
        showErrorToast(err.message); // tampilkan error toast di UI
      }
    };

    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return salesman
      .filter((item) => {
        // Filter berdasarkan globalFilter (hanya untuk employee_name)
        const matchesGlobalFilter =
          !debouncedFilter ||
          item.employee_name
            .toLowerCase()
            .includes(debouncedFilter.toLowerCase());

        const matchesStartDate =
          !filters.startDate ||
          new Date(item.start_date_active).toISOString().split("T")[0] ===
            filters.startDate;

        const matchesEndDate =
          !filters.endDate ||
          (item.end_date_active &&
            new Date(item.end_date_active).toISOString().split("T")[0] ===
              filters.endDate);

        const matchesOrganizationName =
          !filters.organizationName ||
          item.organization_name === filters.organizationName;

        const matchesStatus = !filters.status || item.status === filters.status;

        return (
          matchesGlobalFilter &&
          matchesStartDate &&
          matchesEndDate &&
          matchesOrganizationName &&
          matchesStatus
        );
      })
      .map((item, index) => ({
        id: index,
        employee_name: item.employee_name,
        salesrep_id: String(item.salesrep_id),
        vendor_name: item.vendor_name,
        organization_name: item.organization_name,
        salesrep_number: item.salesrep_number,
      }));
  }, [salesman, debouncedFilter, filters]);

  function handleSelectOrgName(value: string): void {
    setFilters((prev) => ({ ...prev, organizationName: value }));
  }

  function handleSelectStatus(value: string): void {
    setFilters((prev) => ({ ...prev, status: value }));
  }

  function handleStartDateChange(date: Date | null): void {
    const formattedDate = date
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : null;
    setFilters((prev) => ({ ...prev, startDate: formattedDate }));
  }

  function handleEndDateChange(date: Date | null): void {
    const formattedDate = date ? date.toISOString().split("T")[0] : null;
    setFilters((prev) => ({ ...prev, endDate: formattedDate }));
  }

  const handleResetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      organizationName: "",
      status: "",
    });
    setStartDate(null);
    setEndDate(null);
    setSelectedOrgName(null);
    setSelectedStatus(null);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="p-4 bg-white shadow rounded-md mb-5">
            <div className="flex justify-between items-center">
              <div className="space-x-4">
                <Label htmlFor="search">Nama Salesman</Label>
                <Input
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  type="text"
                  id="search"
                  placeholder="🔍 Masukan nama salesman..."
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="space-x-4">
                <Label htmlFor="date-picker">Tanggal Dibuat</Label>
                <DatePicker
                  id="start-date-salesman"
                  placeholder="Select a date"
                  defaultDate={startDate || undefined}
                  onChange={(selectedDates) => {
                    const date = Array.isArray(selectedDates)
                      ? selectedDates[0]
                      : selectedDates;
                    setStartDate(date);
                    handleStartDateChange(date);
                  }}
                />
              </div>

              <div className="space-x-4">
                <Label htmlFor="date-picker">Tanggal Berakhir</Label>
                <DatePicker
                  id="end-date-salesman"
                  placeholder="Select a date"
                  defaultDate={endDate || undefined}
                  onChange={(selectedDates) => {
                    const date = Array.isArray(selectedDates)
                      ? selectedDates[0]
                      : selectedDates;
                    setEndDate(date);
                    handleEndDateChange(date);
                  }}
                />
              </div>

              <div className="space-x-4" style={{ position: "relative" }}>
                <Label htmlFor="jenis-kunjungan-select">
                  Organization Name
                </Label>
                <Select
                  options={optOrgName}
                  placeholder="Pilih"
                  value={selectedOrgName || undefined}
                  onChange={(value) => {
                    setSelectedOrgName(value);
                    handleSelectOrgName(value);
                  }}
                />
              </div>

              <div className="space-x-4" style={{ position: "relative" }}>
                <Label htmlFor="jenis-kunjungan-select">Status</Label>
                <Select
                  options={options}
                  placeholder="Pilih"
                  value={selectedStatus || undefined}
                  className="dark:bg-dark-900 react-select-container"
                  onChange={(value) => {
                    setSelectedStatus(value);
                    handleSelectStatus(value);
                  }}
                />
              </div>

              <div className="flex justify-center items-center mt-5">
                <Button
                  variant="rounded"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  <FaUndo />
                </Button>
              </div>
            </div>
          </div>

          <AdjustTable
            data={filteredData}
            globalFilter={debouncedFilter}
            setGlobalFilter={setGlobalFilter}
            onDetail={handleDetail}
            onDelete={handleDelete}
            onEdit={(data) => setEditMenuData(data)}
          />
        </>
      )}
    </>
  );
};

export default DataTable;
