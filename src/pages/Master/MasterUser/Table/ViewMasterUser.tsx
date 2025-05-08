import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
import { useRoleStore } from "../../../../API/store/MasterStore/masterRoleStore";
import * as XLSX from "xlsx";

import Input from "../../../../components/form/input/InputField";
import AdjustTableUser from "./AdjustTableUser";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";

const TableMasterMenu = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fetchAllUser, user, createUser } = useUserStore();
  const { fetchRoles, roles } = useRoleStore();

  const [importData, setDataImport] = useState<any[]>([]);

  const { canCreate, canManage } = usePagePermissions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllUser();
    };

    const fetchDataRole = async () => {
      await fetchRoles();
    };

    fetchData();
    fetchDataRole();
  }, [fetchAllUser]);

  const tableData = useMemo(() => {
    return user.map((u) => ({
      id: u.id,
      name: u.name || "", // Ensure name exists
      username: u.username,
      email: u.email,
      role_id: u.role_id || "", // Ensure role exists
      branch: u.branch || "",
      create_on: u.create_on || "", // Ensure create_on exists
    }));
  }, [user]);

  const handleCloseModal = () => setIsModalOpen(false);

  const optionRoles = roles.map((role) => ({
    value: role.id.toString(), // Convert value to string
    label: role.name,
  }));

  const formFields = [
    {
      name: "name",
      label: "Nama",
      type: "text",
      validation: { required: "Name is required" },
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      validation: { required: "Username is required" },
    },
    {
      name: "phone_number",
      label: "No. Handphone Kantor",
      type: "text",
      validation: { required: "Phone number is required" },
    },
    {
      name: "roles",
      label: "Roles",
      type: "select",
      options: optionRoles, // Use dynamic roles here
      validation: { required: "Role is required" },
    },
    {
      name: "branch",
      label: "Cabang",
      type: "select",
      options: [
        { value: "JAT", label: "JAT" },
        { value: "KDS", label: "KDS" },
        { value: "BDG", label: "BDG" },
      ],
      validation: { required: "Branch is required" },
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
      name: "password_confirm",
      label: "Konfirmasi Password",
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

  const user_login = (() => {
    const storedUserLogin = localStorage.getItem("user_login_data");
    return storedUserLogin && storedUserLogin !== "undefined"
      ? JSON.parse(storedUserLogin).user
      : null;
  })();

  const handleSubmit = async (payload: any) => {
    console.log("Payload:", payload);

    const formattedPayload = {
      name: payload.name,
      email: payload.email,
      username: payload.username,
      employee_id: payload.username,
      password: payload.password,
      picture: "",
      is_active: true,
      join_date: "2023-01-01T00:00:00Z",
      valid_from: "2023-01-01T00:00:00Z",
      valid_to: "2023-01-01T00:00:00Z",
      role_id: Number(payload.roles),
      created_by: user_login?.username,
      updated_by: user_login?.username,
    };

    console.log("Formatted Payload:", formattedPayload);

    try {
      await createUser(formattedPayload);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

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

  // useEffect(() => {
  //   console.log("Import Data:", importData);
  // }, [importData]);

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Label htmlFor="date-picker">Pencarian</Label>
            <Input
              onChange={(e) => setGlobalFilter(e.target.value)} // Pastikan ini menerima string secara langsung
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
            <Label htmlFor="date-picker">Tanggal Mulai</Label>
            <DatePicker
              id="start-date-stugas"
              placeholder="Select a date"
              onChange={(dates, currentDateString) =>
                console.log({ dates, currentDateString })
              }
            />
          </div>

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
            <Label htmlFor="jenis-kunjungan-select">Posisi</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

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
            <Label htmlFor="jenis-kunjungan-select">Posisi</Label>
            <Select
              options={options}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
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

      <ReusableFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => handleSubmit(data)}
        formFields={formFields}
        title="Create User"
      />

      {/* {editMenuData && (
        <EditMenuModal
          isOpen={!!editMenuData}
          onClose={() => setEditMenuData(null)}
          existingData={editMenuData}
          onRefresh={fetchMenus}
        />
      )} */}
    </>
  );
};

export default TableMasterMenu;
