import React, { use, useEffect, useMemo, useState } from "react";
import { FaPlus, FaFileImport, FaFileDownload, FaUndo } from "react-icons/fa";

import Input from "../../../../components/form/input/InputField";
import AdjustTableUser from "./AdjustTable";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import Button from "../../../../components/ui/button/Button";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";

import { useParametersStore } from "../../../../API/store/ParameterStore/parameterStore";
import { useLocation } from "react-router-dom";

// import DatePicker from "../../../../components/form/date-picker";
// import Label from "../../../../components/form/Label";
// import Select from "../../../../components/form/Select";

const TableMasterMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { canCreate } = usePagePermissions();
  const { createParameter, fetchParameter, parameters } = useParametersStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editData, setEditData] = useState<any>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    fetchParameter(currentPath);
  }, []);

  useEffect(() => {
    if (parameters) {
      const formattedData = parameters.map((item: any) => ({
        id: item.id,
        key: item.key,
        value: item.value,
        label: item.label,
        is_active: item.is_active,
        is_admin: false, // Default value since it's not provided in the API
        created_by: item.created_by,
        created_on: new Date(item.created_at)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        updated_on: new Date(item.updated_at)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        order: item.order,
      }));
      setTableData(formattedData);
    }
  }, [parameters]);

  const user_login = (() => {
    const storedUserLogin = localStorage.getItem("user_login_data");
    return storedUserLogin && storedUserLogin !== "undefined"
      ? JSON.parse(storedUserLogin).user
      : null;
  })();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null); // Reset data edit ketika modal ditutup
  };

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
    {
      name: "is_admin",
      label: "Admin",
      type: "select",
      options: [
        { value: true, label: "Yes" },
        { value: false, label: "No" },
      ],
      validation: { required: "Admin is required" },
    },
  ];

  const handleDetail = (id: number) => {
    console.log("Id", id);
  };

  const handleDelete = async (id: number) => {
    console.log("Id", id);
  };

  const handleEdit = (data: any) => {
    setEditData(data); // Simpan data yang akan diedit
    setIsModalOpen(true); // Buka modal
  };

  const handleSubmit = async (payload: any) => {
    if (editData) {
      // Mode Update
      console.log("Update Payload", payload);
      console.log("Updating item with ID:", editData.id);
      // Tambahkan logika untuk update data di sini
    } else {
      const formattedPayload = {
        key: currentPath,
        value: payload.value,
        label: payload.label,
        is_active: payload.is_active,
        created_by: user_login?.username,
      };

      console.log("Create Payload", formattedPayload);
      await createParameter(formattedPayload);

      // Panggil ulang data setelah berhasil create
      await fetchParameter(currentPath);
    }
    handleCloseModal(); // Tutup modal setelah submit
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
              <FaFileImport className="mr-2" /> Import
            </Button>

            {canCreate && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus className="mr-2" /> Tambah Parameter
              </Button>
            )}
          </div>
        </div>
      </div>

      <AdjustTableUser
        data={tableData}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ReusableFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => handleSubmit(data)}
        formFields={formFields}
        defaultValues={editData}
        title={editData ? "Edit Channel Type" : "Tambah Channel Type"} // Ubah judul modal berdasarkan mode
      />
    </>
  );
};

export default TableMasterMenu;
