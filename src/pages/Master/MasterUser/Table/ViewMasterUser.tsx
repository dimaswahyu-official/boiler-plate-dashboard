import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
import { useRoleStore } from "../../../../API/store/MasterStore/masterRoleStore";
import { useBranchStore } from "../../../../API/store/MasterStore/masterBranchStore";

import * as XLSX from "xlsx";

import Input from "../../../../components/form/input/InputField";
import AdjustTableUser from "./AdjustTableUser";
import FormModal from "../Form/FormModal";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import { useNavigate } from "react-router";

const TableMasterMenu = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchAllUser, user, createUser, error } = useUserStore();
  const { fetchRoles, roles } = useRoleStore();
  const { fetchBranches, branches } = useBranchStore();

  const [importData, setDataImport] = useState<any[]>([]);

  const { canCreate, canManage } = usePagePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllUser();
    };

    const fetchDataRole = async () => {
      await fetchRoles();
    };

    const fetchDataBranches = async () => {
      await fetchBranches();
    };

    fetchData();
    fetchDataRole();
    fetchDataBranches();
  }, [fetchAllUser]);

  const tableData = useMemo(() => {
    return user.map((u) => ({
      id: u.id,
      name: u.employee_name || "",
      email: u.email,
      role: u.role?.name || u.role_name || "",
      branch: String(u.organization_code || ""),
      created_on: u.created_at || "",
      nik: u.employee_id || "",
      nik_spv: u.supervisor_number || "",
      is_active: u.is_active ? "Active" : "Inactive",
      valid_to: u.valid_to || "",
      region_code: u.region_code || "",
    }));
  }, [user]);

  const handleCloseModal = () => setIsModalOpen(false);

  const optionRoles = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const optionBranch = branches.map((branch) => ({
    value: branch.id,
    label: `${branch.organization_name} (${branch.region_code || "No Region"})`,
  }));

  const formFields = [
    {
      name: "name",
      label: "Nama",
      type: "text",
      validation: { required: "Name is required" },
    },
    {
      name: "roles",
      label: "Posisi",
      type: "select",
      options: optionRoles,
      validation: { required: "Role is required" },
      placeholder: "pilih posisi",
    },
    {
      name: "is_employee",
      label: "Jenis Karyawan",
      type: "checkbox",
      validation: {},
      info: "Centang jika pengguna bukan karyawan (non-employee)",
    },
    {
      name: "tsf_type",
      label: "Tipe TSF",
      type: "select",
      options: [
        { value: "internal", label: "Internal" },
        { value: "external", label: "External" },
      ],
      validation: {},
      placeholder: "pilih tipe TSF",
    },
    {
      name: "branch",
      label: "Cabang",
      type: "select",
      options: optionBranch,
      validation: {},
      placeholder: "pilih cabang",
    },
    {
      name: "region",
      label: "Region",
      type: "select",
      options: [
        { value: "region_1", label: "region_1" },
        { value: "region_2", label: "region_2" },
      ],
      validation: {},
      placeholder: "pilih region",
    },
    {
      name: "nik",
      label: "NIK Pegawai",
      type: "text",
      validation: { required: "NIK Pegawai is required" },
    },
    {
      name: "nik_spv",
      label: "NIK Supervisor",
      type: "text",
      validation: { required: "SPV NIK is required" },
    },
    {
      name: "phone_number",
      label: "Nomor HP Kantor",
      type: "text",
      validation: { required: "Phone number is required" },
    },

    {
      name: "email",
      label: "Email",
      type: "text",
      validation: { required: "Email is required" },
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 12,
          message: "Password must be at least 12 characters",
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          message: "Password must include uppercase, lowercase, and a number",
        },
      },
    },
    {
      name: "confirm_password",
      label: "Konfirmasi Password",
      type: "password",
      validation: {
        required: "Konfirmasi password wajib diisi",
      },
    },
    {
      name: "valid_to",
      label: "Tanggal Berakhir",
      type: "date",
      validation: { required: "Tanggal Berakhir is required" },
    },
  ];

  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const handleDetail = (id: number) => {
    console.log("Id", id);
  };

  const handleDelete = async (id: number) => {
    console.log("Id", id);
  };

  function handleSelectChange(value: string): void {
    throw new Error("Function not implemented.");
  }

  const handleSubmit = async (payload: any) => {
    try {
      await createUser(payload);
      if (!error) {
        setIsModalOpen(false);
      } else {
        console.error("Error creating user:", error);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // UPLOAD EXCEL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setDataImport(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click(); // Trigger hidden file input click
  };

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Label htmlFor="date-picker">Pencarian</Label>
            <Input
              onChange={(e) => setGlobalFilter(e.target.value)}
              type="text"
              id="search"
              placeholder="🔍 Search..."
            />
          </div>

          <div className="space-x-4">
            <Button variant="primary" size="sm">
              <FaFileDownload className="mr-2" /> Unduh
            </Button>

            <Button variant="primary" size="sm" onClick={onButtonClick}>
              <FaFileImport className="mr-2" /> Import User
            </Button>

            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {canCreate && canManage && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus className="mr-2" /> Tambah User
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Posisi</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Region</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Cabang</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Status</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="date-picker">Tanggal Dibuat</Label>
            <DatePicker
              id="create-date"
              placeholder="Select a date"
              onChange={(dates, currentDateString) =>
                console.log({ dates, currentDateString })
              }
            />
          </div>

          <div className="flex justify-center items-center mt-5">
            <Button
              variant="rounded"
              size="sm"
              onClick={() => alert("Reset Filters")}
            >
              <FaUndo />
            </Button>
          </div>
        </div>
      </div>

      <AdjustTableUser
        data={tableData}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => handleSubmit(data)}
        formFields={formFields}
        title="Create User"
      />
    </>
  );
};

export default TableMasterMenu;
