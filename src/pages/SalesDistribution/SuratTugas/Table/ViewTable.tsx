import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaFileImport,
  FaFileDownload,
  FaUndo,
  FaStepForward,
} from "react-icons/fa";
import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
import { useRoleStore } from "../../../../API/store/MasterStore/masterRoleStore";

import Input from "../../../../components/form/input/InputField";
import AdjustTable from "./AdjustTable";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";

const TableMasterCustomer = () => {
  const { fetchAllUser, user, createUser } = useUserStore();
  const { fetchRoles, roles } = useRoleStore();
  const { canCreate } = usePagePermissions();

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

  //   const tableData = useMemo(() => {
  //     return user.map((u) => ({
  //       id: u.id,
  //       name: u.name || "", // Ensure name exists
  //       username: u.username,
  //       email: u.email,
  //       role: u.role || "", // Ensure role exists
  //       branch: u.branch || "",
  //       create_on: u.create_on || "", // Ensure create_on exists
  //     }));
  //   }, [user]);

  const dummyData = [
    {
      id: 1,
      id_route: "RUTE-SALES01",
      id_salesman: "Salesman01",
      salesman_name: "Salesman01",
      branch: "JAT",
      route: "RUTE-SALES01",
    },
    {
      id: 2,
      id_route: "RUTE-SALES02",
      id_salesman: "Salesman02",
      salesman_name: "Salesman02",
      branch: "JAT",
      route: "RUTE-SALES02",
    },
    {
      id: 3,
      id_route: "RUTE-SALES03",
      id_salesman: "Salesman03",
      salesman_name: "Salesman03",
      branch: "JAT",
      route: "RUTE-SALES03",
    },
    {
      id: 4,
      id_route: "RUTE-SALES04",
      id_salesman: "Salesman04",
      salesman_name: "Salesman04",
      branch: "JAT",
      route: "RUTE-SALES30",
    },
    {
      id: 5,
      id_route: "RUTE-SALES05",
      id_salesman: "Salesman05",
      salesman_name: "Salesman05",
      branch: "JAT",
      route: "RUTE-SALES05",
    },
  ];

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

  const optKunjungan = [{ value: "canvas", label: "canvas" }];

  const optRoute = [
    { value: "LD", label: "Luar Kota" },
    { value: "DK", label: "Dalam Kota" },
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
      join_date: "2023-01-01T00:00:00Z", // Current date as join_date
      valid_from: "2023-01-01T00:00:00Z", // Current date as valid_from
      valid_to: "2023-01-01T00:00:00Z",
      role_id: parseInt(payload.roles.value, 10), // Ensure role_id is sent as a number
      created_by: user_login?.username, // Handle null user_login
      updated_by: user_login?.username, // Handle null user_login
    };

    try {
      await createUser(formattedPayload);
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
              onClick={() => alert("Proses Data")}
            >
              <FaStepForward className="mr-2" /> Proses
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date-picker">Tanggal Mulai</Label>
            <DatePicker
              id="start-date-stugas"
              placeholder="Select a date"
              onChange={(dates, currentDateString) =>
            console.log({ dates, currentDateString })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date-picker">Tanggal Selesai</Label>
            <DatePicker
              id="end-date-stugas"
              placeholder="Select a date"
              onChange={(dates, currentDateString) =>
            console.log({ dates, currentDateString })
              }
            />
          </div>

          <div className="flex flex-col gap-2 ml-2">
            <Label htmlFor="jenis-kunjungan-select">Jenis Kunjungan</Label>
            <Select
              options={optKunjungan}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="jenis-rute-select">Jenis Rute</Label>
            <Select
              options={optRoute}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="flex justify-center items-center">
            <Button
              variant="rounded"
              size="md"
              onClick={() => alert("Reset Filters")}
            >
              <FaUndo />
            </Button>
          </div>
        </div>
      </div>

      <AdjustTable
        data={dummyData}
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
    </>
  );
};

export default TableMasterCustomer;
