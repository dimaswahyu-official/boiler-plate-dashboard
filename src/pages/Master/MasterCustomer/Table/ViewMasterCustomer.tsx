import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaFileImport,
  FaFileDownload,
  FaUndo,
  FaStepForward,
  FaDownload,
} from "react-icons/fa";
import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
import { useRoleStore } from "../../../../API/store/MasterStore/masterRoleStore";

import Input from "../../../../components/form/input/InputField";
import AdjustTable from "./AdjustTableCustomer";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";
import dummyCustomer from "../../../../helper/dummyCustomer";

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

  const handleSubmit = async (payload: any) => {
    console.log("Payload", payload);

    // try {
    //   await createUser(formattedPayload);
    // } catch (error) {
    //   console.error("Error creating user:", error);
    // }
  };

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
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Proses Data")}
            >
              <FaDownload className="mr-2" /> Unduh
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Proses Data")}
            >
              <FaFileImport className="mr-2" /> Import
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => alert("Proses Data")}
            >
              <FaPlus className="mr-2" /> Tambah Customer
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="space-x-4">
            <Label htmlFor="jenis-kunjungan-select">Kategori</Label>
            <Select
              options={optKunjungan}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-rute-select">Cabang</Label>
            <Select
              options={optRoute}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-rute-select">Channel</Label>
            <Select
              options={optRoute}
              placeholder="Pilih"
              onChange={handleSelectChange}
              className="dark:bg-dark-900 react-select-container"
            />
          </div>

          <div className="space-x-4">
            <Label htmlFor="jenis-rute-select">Status</Label>
            <Select
              options={optRoute}
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

      <AdjustTable
        data={[dummyCustomer]}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
      />

      {/* <ReusableFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => handleSubmit(data)}
        formFields={formFields}
        title="Create User"
      /> */}
    </>
  );
};

export default TableMasterCustomer;
