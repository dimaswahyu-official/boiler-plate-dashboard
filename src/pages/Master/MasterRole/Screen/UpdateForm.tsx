import React, { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useMenuStore } from "../../../../API/store/menuStore";
import { useRoleStore } from "../../../../API/store/roleStore";

// Constants for options
const STATUS_OPTIONS = [
  { value: "", label: "-- Pilih Status --" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const ACCESS_OPTIONS = [
  { value: "", label: "-- Pilih Opsi --" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const PERMISSION_TYPES = ["Create", "Update", "View", "Delete", "Manage"];

const commonClasses =
  "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300";

// Reusable Input Component
const InputField = ({
  label,
  id,
  register,
  placeholder,
  type = "text",
  ...rest
}: any) => (
  <div className="mt-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      {...register(id)}
      placeholder={placeholder}
      className={commonClasses}
      {...rest}
    />
  </div>
);

// Reusable Select Component
const SelectField = ({ label, name, control, options, placeholder }: any) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          placeholder={placeholder}
          className="mt-1"
        />
      )}
    />
  </div>
);

export default function UpdateFormWithTable(paramRole: any) {
  const navigate = useNavigate();
  const { fetchMenus, menus } = useMenuStore();
  const { updateRole } = useRoleStore();

  const { control, register, getValues } = useForm({
    defaultValues: {
      nama: paramRole.paramRole.name || "",
      deskripsi: paramRole.paramRole.description || "",
      status: null,
      aksesMobile: null,
      aksesDashboard: null,
    },
  });

  const flattenMenus = (menuData: any[]) => {
    const result: any[] = [];
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(menuData);
    return result;
  };
  const flattenedMenus = useMemo(() => flattenMenus(menus), [menus]);

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (paramRole.paramRole.permissions) {
      paramRole.paramRole.permissions.forEach((permission: any) => {
        const menuIndex = flattenedMenus.findIndex(
          (menu) => menu.id === permission.menu_id
        );
        if (menuIndex !== -1) {
          const row = document.querySelectorAll("tbody tr")[menuIndex];
          const checkboxes = row.querySelectorAll("input[type='checkbox']");
          const permissionIndex = PERMISSION_TYPES.indexOf(
            permission.permission_type
          );
          if (permissionIndex !== -1) {
            (checkboxes[permissionIndex] as HTMLInputElement).checked = true;
          }
        }
      });
    }
  }, [flattenedMenus, paramRole.paramRole.permissions]);

  const handleCaptureData = async () => {
    const formData = getValues();
    const tableData = flattenedMenus
      .map((menu: any, index: number) => {
        const row = document.querySelectorAll("tbody tr")[index];
        const checkboxes = row.querySelectorAll("input[type='checkbox']");
        return PERMISSION_TYPES.map((type, i) => {
          if ((checkboxes[i] as HTMLInputElement).checked) {
            return { menu_id: Number(menu.id), permission_type: type };
          }
          return null;
        });
      })
      .flat()
      .filter(
        (
          permission
        ): permission is { menu_id: number; permission_type: string } =>
          permission !== null
      );

    const updateId = paramRole.paramRole.id;
    if (!updateId) {
      console.error("Error: Role ID is missing.");
      return;
    }

    if (tableData.length === 0) {
      console.error("Error: At least one permission must be selected.");
      return;
    }

    const finalPayload = {
      name: formData.nama,
      description: formData.deskripsi,
      permissions: tableData,
    };

    if (!finalPayload.name || !finalPayload.description) {
      console.error("Error: Name and description cannot be empty.");
      return;
    }

    console.log("Final Payload:", finalPayload);
    console.log("paramRole", paramRole.paramRole.id);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch(
        `http://10.0.29.47/api/v1/roles/${updateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(finalPayload),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update role: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Role updated successfully:", result.statusCode);

      if (result.statusCode === 200) {
        setTimeout(() => {
          navigate("/master_role");
        }, 800);
      }
    } catch (error: any) {
      alert(`Failed to update role: ${error.message}`);
      console.error("Failed to update role:", error.message);
    }
  };

  return (
    <div>
      {/* FORM */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <form>
          <h3 className="text-xl font-semibold mb-4">Update Role</h3>

          <InputField
            label="Nama"
            id="nama"
            register={register}
            placeholder="Nama Posisi"
          />

          <div className="mt-4">
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-gray-700"
            >
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              {...register("deskripsi")}
              placeholder="Deskripsi"
              rows={4}
              className={commonClasses}
            />
          </div>

          <SelectField
            label="Status"
            name="status"
            control={control}
            options={STATUS_OPTIONS}
            placeholder="-- Pilih Status --"
          />

          <SelectField
            label="Akses Mobile"
            name="aksesMobile"
            control={control}
            options={ACCESS_OPTIONS}
            placeholder="-- Pilih Opsi --"
          />

          <SelectField
            label="Akses Dashboard"
            name="aksesDashboard"
            control={control}
            options={ACCESS_OPTIONS}
            placeholder="-- Pilih Opsi --"
          />
        </form>
      </div>

      {/* TABLE */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Akses Menu</h3>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Id</th>
              <th className="border border-gray-300 px-4 py-2">Nama Menu</th>
              {PERMISSION_TYPES.map((type) => (
                <th key={type} className="border border-gray-300 px-4 py-2">
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flattenedMenus.map((menu: any, index: number) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{menu.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {menu.name}
                </td>
                {PERMISSION_TYPES.map((type, i) => (
                  <td
                    key={type}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    <input type="checkbox" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleCaptureData}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Update
        </button>
      </div>
    </div>
  );
}
