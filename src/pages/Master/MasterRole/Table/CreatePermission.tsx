import React, { useEffect, useMemo, useState, useRef } from "react";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import Checkbox from "../../../../components/form/input/Checkbox";

const permissions = ["Create", "Update", "View", "Delete", "Manage"];

interface TableMenuPermissionProps {
  onChange: (data: any) => void; // Prop untuk mengirim data ke parent
  defaultPermissions?: { menu_id: number; permission_type: string }[]; // Data permissions dari API
}

const TableMenuPermission: React.FC<TableMenuPermissionProps> = ({
  onChange,
  defaultPermissions = [],
}) => {
  const { fetchMenus, menus } = useMenuStore();
  const [selectedPermissions, setSelectedPermissions] = useState<any>({});
  const isMounted = useRef(false);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // // Proses defaultPermissions menjadi format yang sesuai untuk selectedPermissions
  // useEffect(() => {
  //   if (defaultPermissions.length > 0) {
  //     const initialPermissions: any = {};
  //     defaultPermissions.forEach(({ menu_id, permission_type }) => {
  //       if (!initialPermissions[menu_id]) {
  //         initialPermissions[menu_id] = {};
  //       }
  //       initialPermissions[menu_id][permission_type] = true; // Set permission ke true
  //     });
  //     setSelectedPermissions(initialPermissions); // Set nilai awal checkbox

  //     // Hanya panggil onChange jika komponen sudah pernah dirender
  //     if (isMounted.current) {
  //       onChange(initialPermissions);
  //     }
  //   }
  // }, [defaultPermissions, onChange]);

  useEffect(() => {
    if (defaultPermissions.length > 0) {
      const initialPermissions: any = {};
      defaultPermissions.forEach(({ menu_id, permission_type }) => {
        if (!initialPermissions[menu_id]) {
          initialPermissions[menu_id] = [];
        }
        if (!initialPermissions[menu_id].includes(permission_type)) {
          initialPermissions[menu_id].push(permission_type);
        }
      });
      setSelectedPermissions(initialPermissions); // Set nilai awal checkbox

      // Kirim data ke parent
      if (isMounted.current) {
        onChange(
          Object.entries(initialPermissions).flatMap(([menuId, perms]) =>
            (perms as string[]).map((permission) => ({
              menu_id: Number(menuId),
              permission_type: permission,
            }))
          )
        );
      }
    }
  }, [defaultPermissions, onChange]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  const handleCheckboxChange = (menuId: number, permission: string) => {
    if (!menuId || !permissions.includes(permission)) {
      console.warn(`Invalid menu_id (${menuId}) or permission (${permission})`);
      return; // Abaikan perubahan jika data tidak valid
    }

    setSelectedPermissions((prev: any) => {
      const updated = { ...prev };

      // Pastikan menuId ada di objek
      if (!updated[menuId]) {
        updated[menuId] = [];
      }

      // Toggle permission: tambahkan jika belum ada, hapus jika sudah ada
      if (updated[menuId].includes(permission)) {
        updated[menuId] = updated[menuId].filter(
          (perm: string) => perm !== permission
        );
      } else {
        updated[menuId].push(permission);
      }

      // Kirim data ke parent
      onChange(
        Object.entries(updated).flatMap(([menuId, perms]) =>
          (perms as string[]).map((permission) => ({
            menu_id: Number(menuId),
            permission_type: permission,
          }))
        )
      );

      return updated;
    });
  };

  // const handleCheckboxChange = (menuId: number, permission: string) => {
  //   if (!menuId || !permissions.includes(permission)) {
  //     console.warn(`Invalid menu_id (${menuId}) or permission (${permission})`);
  //     return; // Abaikan perubahan jika data tidak valid
  //   }

  //   setSelectedPermissions((prev: any) => {
  //     const updated = { ...prev };

  //     // Pastikan hanya satu checkbox dalam kolom yang sama dapat dipilih
  //     if (!updated[menuId]) {
  //       updated[menuId] = {};
  //     }

  //     // Reset semua permissions untuk menuId
  //     Object.keys(updated[menuId]).forEach((perm) => {
  //       updated[menuId][perm] = false;
  //     });

  //     // Set permission yang baru dipilih
  //     updated[menuId][permission] = true;

  //     onChange(updated); // Kirim data ke parent hanya saat ada perubahan
  //     return updated;
  //   });
  // };

  return (
    <div className="mt-8">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">Akses Menu</h3>
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Nama Menu</th>
              {permissions.map((perm) => (
                <th key={perm} className="border px-4 py-2 text-center">
                  {perm}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flattenedMenus.map((menu) => (
              <tr key={menu.id}>
                <td className="border px-4 py-2">{menu.id}</td>
                <td className="border px-4 py-2">{menu.name}</td>

                {permissions.map((perm) => (
                  <td
                    key={`${menu.id}-${perm}`}
                    className="border px-4 py-2 text-center"
                  >
                    {/* <input
                      type="checkbox"
                      checked={selectedPermissions[menu.id]?.[perm] || false}
                      onChange={() => handleCheckboxChange(menu.id, perm)}
                    /> */}

                    {/* <Checkbox
                      checked={selectedPermissions[menu.id]?.[perm] || false}
                      onChange={() => handleCheckboxChange(menu.id, perm)}
                      label=""
                    /> */}

                    <Checkbox
                      checked={
                        selectedPermissions[menu.id]?.includes(perm) || false
                      }
                      onChange={() => handleCheckboxChange(menu.id, perm)}
                      label=""
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableMenuPermission;
