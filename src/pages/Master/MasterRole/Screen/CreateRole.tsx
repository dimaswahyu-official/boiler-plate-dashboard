import React, { useState } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import DynamicForm, {
  FieldConfig,
} from "../../../../components/form-input/DynamicForm";
import TableMenuPermission from "../Table/CreatePermission";
import { useRoleStore } from "../../../../API/store/roleStore";

const fields: FieldConfig[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    name: "accessMobile",
    label: "Akses Mobile",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    name: "accessDashboard",
    label: "Akses Dashboard",
    type: "select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
  },
];

function CreateRole() {
  const { createRole } = useRoleStore(); // Ambil fungsi createRole dari store

  const [tableData, setTableData] = useState<any>({});

  const handleTableChange = (data: any) => {
    // Use a timeout to defer the state update to avoid updating during render
    setTimeout(() => setTableData(data), 0); // Simpan data dari table
  };

  const handleSubmit = async (formData: any) => {
    // Transformasikan permissions menjadi array
    const transformedPermissions = Object.entries(tableData).flatMap(
      ([menuId, permissions]) =>
        Object.entries(permissions as Record<string, boolean>)
          .filter(([_, isChecked]) => isChecked) // Hanya ambil yang dicentang
          .map(([permissionType]) => ({
            menu_id: parseInt(menuId, 10), // Ubah menuId menjadi number
            permission_type: permissionType,
          }))
    );

    // Buat payload akhir
    const payload = {
      name: formData.name,
      description: formData.description,
      permissions: transformedPermissions,
    };

    console.log("Final Payload:", payload);

    try {
      // Panggil fungsi createRole dari roleStore
      await createRole(payload);
      console.log("Role created successfully!");
      alert("Role berhasil dibuat!");
    } catch (error: any) {
      console.error("Failed to create role:", error.message);
      alert("Gagal membuat role: " + error.message);
    }
  };
  return (
    <>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Master Role", path: "/master_role" },
          { title: "Create Role" },
        ]}
      />

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Kiri */}
          <div className="bg-white p-6 rounded-md border">
            <DynamicForm fields={fields} onSubmit={handleSubmit} />
          </div>

          {/* Table Kanan */}
          <div className="bg-white p-6 rounded-md border">
            <TableMenuPermission onChange={handleTableChange} />
          </div>
        </div>

        {/* Tombol Bawah */}
        <div className="flex justify-end mt-6 gap-4">
          <button className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50">
            Kembali
          </button>
          <button
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            onClick={() =>
              document
                .querySelector("form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                )
            }
          >
            Tambah
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateRole;
