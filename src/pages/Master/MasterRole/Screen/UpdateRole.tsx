import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import DynamicForm, { FieldConfig } from "../../../../components/form-input/DynamicForm";
import TableMenuPermission from "../Table/TableMenuPermission";
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

function UpdateRole() {
  const location = useLocation();
  const navigate = useNavigate();

  const { id } = location.state || {};
  const { fetchRoleById, updateRole } = useRoleStore();
  const [roleData, setRoleData] = useState<any>(null);
  const [tableData, setTableData] = useState<any>({});

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await fetchRoleById(id);
          console.log("Fetched role data:", data);

          setRoleData(data);
          // Transformasi data permissions ke format yang diharapkan
          const transformedPermissions = data.permissions.reduce(
            (acc: Record<number, Record<string, boolean>>, perm) => {
              if (!acc[perm.menu_id]) {
                acc[perm.menu_id] = {};
              }
              acc[perm.menu_id][perm.permission_type.toLowerCase()] = true;
              return acc;
            },
            {}
          );

          setTableData(transformedPermissions);
        } catch (error) {
          console.error("Failed to fetch role data:", error);
        }
      };

      fetchData();
    }
  }, [id, fetchRoleById]);

  const handleTableChange = useCallback((data: any) => {
    console.log("Updated Permissions Data:", data);
    setTableData(data);
  }, []);

  const clearForm = () => {
    setRoleData({
      name: "",
      description: "",
      status: "",
      accessMobile: "",
      accessDashboard: "",
    });
  };

  const clearCheckbox = () => {
    setTableData({});
  };

  const handleSubmit = async (formData: any) => {
    console.log("Form Data:", formData);

    // Jika tidak ada perubahan pada permissions, gunakan permissions default
    const transformedPermissions = Object.entries(tableData).flatMap(
      ([menuId, permissions]) =>
        Object.entries(permissions as Record<string, boolean>)
          .filter(([_, isChecked]) => isChecked)
          .map(([permissionType]) => ({
            menu_id: parseInt(menuId, 10),
            permission_type:
              permissionType.charAt(0).toUpperCase() + permissionType.slice(1),
          }))
    );

    // Jika tidak ada permissions yang dipilih, gunakan permissions default
    const finalPermissions =
      transformedPermissions.length > 0
        ? transformedPermissions
        : roleData.permissions;

    console.log("Final Permissions:", finalPermissions);

    const payload = {
      name: formData.name,
      description: formData.description,
      permissions: finalPermissions,
    };

    console.log("iD Updete", id);
    console.log("Final Payload:", payload);

    try {
      //   await updateRole(id, payload); // Panggil fungsi updateRole dari store

      const response = await updateRole(id, payload);
      console.log("Response Update!", response);

      // Clear form and checkbox
      //   clearForm();
      //   clearCheckbox();

      // Navigate ke halaman master_role
        navigate("/master_role");
    } catch (error: any) {
      console.error("Failed to update role:", error.message);
    //   alert("Gagal memperbarui role: " + error.message);
    }
  };

  return (
    <>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Master Role", path: "/master_role" },
          { title: "Update Role" },
        ]}
      />

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-md border">
            {roleData && (
              <DynamicForm
                fields={fields}
                onSubmit={handleSubmit}
                defaultValues={{
                  name: roleData.name,
                  description: roleData.description,
                  status: roleData.status,
                  accessMobile: roleData.accessMobile,
                  accessDashboard: roleData.accessDashboard,
                }}
              />
            )}
          </div>

          <div className="bg-white p-6 rounded-md border">
            <TableMenuPermission
              onChange={handleTableChange}
              defaultPermissions={roleData?.permissions} // Kirim data permissions ke table
            />
          </div>
        </div>

        {/* Tombol Bawah */}
        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
            onClick={() => navigate("/master_role")}
          >
            Kembali
          </button>
          <button
            className="ml-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            onClick={() =>
              document
                .querySelector("form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                )
            }
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default UpdateRole;
