import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";
import { useUserStore } from "../../../../API/store/masterUserStore";
import { useRoleStore } from "../../../../API/store/roleStore";

import Input from "../../../../components/form/input/InputField";
import AdjustTableUser from "./AdjustTable";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import Button from "../../../../components/ui/button/Button";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";

const TableMasterMenu = () => {
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
      name: "value",
      label: "Value",
      type: "text",
      validation: { required: "value is required" },
    },
    {
      name: "label",
      label: "Label",
      type: "text",
      validation: { required: "label is required" },
    },
    {
      name: "is_active",
      label: "Status",
      type: "select",
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Non-Active" },
      ],
      validation: { required: "Status is required" },
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

            {canCreate && (
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
                id="filter-date-picker"
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
        title="Tambah Channel Type"
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
