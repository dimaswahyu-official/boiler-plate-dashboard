import React, { useEffect, useMemo, useState, useRef, use } from "react";
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
import { showSuccessToast } from "../../../../components/toast";

const TableMasterMenu = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchAllUser, user, createUser, fetchDetailUser } = useUserStore();
  const { fetchRoles, roles } = useRoleStore();
  const { fetchBranches, branches } = useBranchStore();

  const [importData, setDataImport] = useState<any[]>([]);

  const { canCreate, canManage } = usePagePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [selectedUserData, setSelectedUserData] = useState<any>(null); // State untuk menyimpan data user yang dipilih

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDataUser = async () => {
      await fetchAllUser();
    };

    const fetchDataRole = async () => {
      await fetchRoles();
    };

    const fetchDataBranches = async () => {
      await fetchBranches();
    };

    fetchDataUser();
    fetchDataRole();
    fetchDataBranches();
  }, []);

  // useEffect(() => {
  //   // console.log("User data fetched:", user);
  //   console.log("User Detail data fetched:", userDetail);
  // }, []);

  const tableData = useMemo(() => {
    return user.map((u) => ({
      id: u.id,
      name: u.employee_name || u.salesrep_name || u.sales_name || "null",
      email: u.email,
      role: u.role?.name || u.role_name || "",
      branch: String(u.organization_code || ""),
      created_on: u.created_at || "",
      nik: u.employee_id || u.salesrep_number || "",
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

  const optionRegion = branches
    .map((branch) => ({
      value: branch.region_code,
      label: branch.region_name,
    }))
    .filter(
      (region, index, self) =>
        region.value &&
        self.findIndex((r) => r.value === region.value) === index
    );

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
      options: optionRegion,
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

  const handleDetail = async (id: number) => {
    // 1. Cari item di tabel (hanya untuk mendapatkan employee_id)
    const userData = user.find((u) => u.id === id);

    if (!userData) {
      console.error(`User with id ${id} not found`);
      return;
    }

    // 2. Pastikan employee_id ada
    if (!userData.employee_id) {
      console.error(`User ${id} tidak mempunyai employee_id`);
      return;
    }

    // 3. Ambil detail terbaru dari server
    const { ok, data, message } = await fetchDetailUser(userData.employee_id);

    if (!ok || !data) {
      console.error(message ?? "Gagal ambil detail user");
      return;
    }

    // 4. Siapkan data untuk modal
    setSelectedUserData({
      ...data,
      roles: optionRoles.find((role) => role.value === data.role_id),
      branches: optionBranch.find((branch) => branch.value === data.branch_id),
      regions: optionRegion.find((region) => region.value === data.region_code),
    });

    setModalMode("update");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    console.log("Id", id);
  };

  function handleSelectChange(value: string): void {
    throw new Error("Function not implemented.");
  }

  const handleSubmit = async (payload: any) => {
    const result = await createUser(payload);
    if (!result.ok) {
      return;
    }
    showSuccessToast("Berhasil tambah user");
    setIsModalOpen(false);
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
                onClick={() => {
                  setModalMode("create"); // Set mode ke "create"
                  setIsModalOpen(true); // Buka modal
                }}
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
        title={modalMode === "create" ? "Create User" : "Detail User"}
        defaultValues={modalMode === "update" ? selectedUserData : undefined} // Data default untuk update
        mode={modalMode} // Pass mode
      />
    </>
  );
};

export default TableMasterMenu;
