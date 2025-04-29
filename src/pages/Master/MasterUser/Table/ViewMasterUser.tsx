import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import { useUserStore } from "../../../../API/store/masterUserStore";
import { useRoleStore } from "../../../../API/store/roleStore";

import Input from "../../../../components/form/input/InputField";
import AdjustTableUser from "./AdjustTableUser";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";

const TableMasterMenu = () => {
  const { fetchAllUser, user, createUser } = useUserStore();
  const { fetchRoles, roles } = useRoleStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

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

  useEffect(() => {
    console.log("role", roles);
  }, [roles]);

  const tableData = useMemo(() => {
    return user.map((u) => ({
      id: u.id,
      name: u.name || "", // Ensure name exists
      username: u.username,
      email: u.email,
      role: u.role || "", // Ensure role exists
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
    const formattedPayload = {
      name: payload.name, // Add the name property
      email: payload.email,
      username: payload.username,
      employee_id: payload.username, // Assuming employee_id is the same as username
      password: payload.password,
      picture: "https://picsum.photos/seed/xvqRwaMRt/640/480", // Static picture URL
      is_active: true,
      join_date: new Date().toISOString(), // Current date as join_date
      valid_from: new Date().toISOString(), // Current date as valid_from
      valid_to: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(), // One year from now
      role_id: payload.roles,
      created_by: user_login.username, // Static created_by
      updated_by: user_login.username, // Static updated_by
    };

    try {
      await createUser(formattedPayload);
      console.log("User created successfully:", formattedPayload);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <Input
            onChange={(e) => setGlobalFilter(e.target.value)} // Pastikan ini menerima string secara langsung
            type="text"
            id="search"
            placeholder="🔍 Search..."
          />
          <div className="space-x-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Download Users")}
            >
              <FaFileDownload className="mr-2" /> Unduh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Import Users")}
            >
              <FaFileImport className="mr-2" /> Import User
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus className="mr-2" /> Tambah User
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="space-x-4 flex items-center">
            {["Posisi", "Cabang", "Wilayah", "Status"].map((label) => (
              <div key={label}>
                <Label htmlFor={`${label.toLowerCase()}-select`}>{label}</Label>
                <Select
                  options={options}
                  placeholder={`Pilih ${label}`}
                  onChange={handleSelectChange}
                  className="dark:bg-dark-900 react-select-container mr-5"
                />
              </div>
            ))}
            <div>
              <Label htmlFor="date-picker">Tanggal Dibuat</Label>
              <DatePicker
                id="date-picker"
                placeholder="Select a date"
                onChange={(dates, currentDateString) =>
                  console.log({ dates, currentDateString })
                }
              />
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                size="sm"
                className="rounded-full p-3"
                onClick={() => alert("Reset Filters")}
              >
                <FaUndo />
              </Button>
            </div>
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
