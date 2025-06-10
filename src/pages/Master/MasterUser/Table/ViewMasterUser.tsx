import React, { useEffect, useMemo, useState, useRef} from "react";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
import { useRoleStore } from "../../../../API/store/MasterStore/masterRoleStore";
import { useBranchStore } from "../../../../API/store/MasterStore/masterBranchStore";
import { useRegionStore } from "../../../../API/store/MasterStore/masterRegionStore";
import { useCheckEmployee } from "../../../../API/store/MasterStore/masterEmployeeStore";

import * as XLSX from "xlsx";

import Input from "../../../../components/form/input/InputField";
import AdjustTableUser from "./AdjustTableUser";
import FormModal from "../Form/FormModal";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";
import { showErrorToast, showSuccessToast } from "../../../../components/toast";

const TableMasterMenu = () => {
  const hasFetched = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchAllUser, user, createUser, fetchDetailUser } = useUserStore();
  const { fetchRoles, roles } = useRoleStore();
  const { fetchBranches, branches } = useBranchStore();
  const { fetchRegion, regions } = useRegionStore();
  const { checkingEmployee, employeeData } = useCheckEmployee();

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

    const fetchDataregions = async () => {
      await fetchRegion();
    };

    fetchDataUser();
    fetchDataRole();
    fetchDataBranches();
    fetchDataregions();
  }, []);

  // Menggunakan useMemo untuk mengoptimalkan performa
  const tableData = useMemo(() => {
    return user.map((u) => {
      return {
        id: u.id,
        name: u.employee_name || "",
        email: u.email,
        role: u.role?.name || u.role_name || "",
        branch: String(u.organization_code || ""),
        created_on: u.created_at || "",
        nik: u.employee_number || "",
        nik_spv: u.supervisor_number || "",
        valid_to: u.valid_to || "",
        region_code: u.region_code || "",
        region_name: u.region_name || "",
        is_active: u.is_active ? "Active" : "Inactive",
        is_sales: u.is_sales ? "Yes" : "No",
      };
    });
  }, [user, regions]);

  const handleCloseModal = () => setIsModalOpen(false);

  const optionRoles = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const optionBranch = branches.map((branch) => ({
    value: branch.id,
    label: `${branch.organization_name} (${branch.region_code || "No Region"})`,
  }));

  const optionRegion = regions
    .map((region) => ({
      value: region.region_code,
      label: region.region_name,
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
    // {
    //   name: "is_employee",
    //   label: "Jenis Karyawan",
    //   type: "checkbox",
    //   validation: {},
    //   info: "Centang jika pengguna bukan karyawan (non-employee)",
    // },
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
      validation: {
        required: "NIK Pegawai is required",
        pattern: {
          value: /^.{14,16}$/,
          message: "NIK Pegawai must be 14-16 characters",
        },
      },
    },
    {
      name: "nik_spv",
      label: "NIK Supervisor",
      type: "text",
      validation: {
        required: "NIK Supervisor is required",
        pattern: {
          value: /^.{14,16}$/,
          message: "NIK Supervisor harusnya 14-16 characters",
        },
      },
    },
    {
      name: "phone_number",
      label: "Nomor HP Kantor",
      type: "text",
      validation: {
        required: "Phone number is required",
        pattern: {
          value: /^\d{10,12}$/,
          message: "Nomor handphone harus 10-12 digits",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Email harus memakai alamat email yang valid",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      validation: {
        required: "Password is required",
        minLength: {
          value: 12,
          message: "Password harus lebih dari 12 characters",
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
          message:
            "Password harus mengandung huruf besar, huruf kecil, dan angka",
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
      showErrorToast(`User dengan id ${id} tidak ditemukan`);
      console.error(`User with id ${id} not found`);
      return;
    }

    // 2. Pastikan employee_id ada
    if (!userData.employee_id) {
      showErrorToast(`User ${id} tidak mempunyai employee_id`);
      console.error(`User ${id} tidak mempunyai employee_id`);
      return;
    }

    // 3. Ambil detail terbaru dari server
    const { ok, data, message } = await fetchDetailUser(userData.employee_id);

    if (!ok || !data) {
      showErrorToast(message ?? "Gagal ambil detail user");
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
  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (evt) => {
  //     const bstr = evt.target?.result;
  //     const workbook = XLSX.read(bstr, { type: "binary" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //     setDataImport(jsonData);
  //   };
  //   reader.readAsBinaryString(file);    
  // };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      alert("Silakan pilih file Excel terlebih dahulu.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://10.0.29.47:9003/api/v1/admin/user/import",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Import gagal");
      }

      const result = await response.json();
      showSuccessToast("Import berhasil!");
      console.log(result);
    } catch (error) {
      console.error("Import error:", error);
      alert("Terjadi kesalahan saat mengimpor file.");
    }
  };

  const onButtonImport = () => {
    fileInputRef.current?.click();
  };

  const onButtonExport = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const response = await fetch(
        "http://10.0.29.47:9003/api/v1/admin/user/export",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengunduh file");
      }

      const blob = await response.blob();

      // Format tanggal hari ini: yyyy-mm-dd
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // contoh: "2025-06-09"

      // Ambil nama file dari header jika ada, atau gunakan default
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
      const baseFilename = filenameMatch
        ? filenameMatch[1].split(".")[0]
        : "users_export";

      const filename = `${baseFilename}_${formattedDate}.xlsx`;

      // Buat link download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Bersihkan
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Terjadi kesalahan saat mengekspor file.");
    }
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
            <Button variant="outline" size="sm" onClick={onButtonExport}>
              <FaFileDownload className="mr-2" /> Unduh Data
            </Button>

            <Button variant="outline" size="sm" onClick={onButtonImport}>
              <FaFileImport className="mr-2" />  Unggah Data
            </Button>

            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="block"
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
