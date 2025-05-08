import { useState, useEffect } from "react";
import { useRoleStore } from "../API/store/MasterStore/masterRoleStore";

export type GroupedPermission = {
  menu_id: number;
  permissions: string[];
};

export const usePermission = () => {
  const { fetchRoleById } = useRoleStore();
  const [permissions, setPermissions] = useState<GroupedPermission[]>([]);
  const role_id = Number(localStorage.getItem("role_id"));

  useEffect(() => {
    if (role_id) {
      if (role_id === 1) {
        // Jika role_id 1, otomatis Manage semua menu
        setPermissions([{ menu_id: -1, permissions: ["Manage"] }]);
      } else {
        fetchRoleById(role_id)
          .then((response) => {
            console.log("Fetched role permissions:", response.permissions);

            // Grouping: gabungkan permission_type untuk menu_id yang sama
            const groupedPermissions = (response.permissions || []).reduce(
              (acc: GroupedPermission[], curr) => {
                const existing = acc.find(
                  (item) => item.menu_id === curr.menu_id
                );
                if (existing) {
                  if (!existing.permissions.includes(curr.permission_type)) {
                    existing.permissions.push(curr.permission_type);
                  }
                } else {
                  acc.push({
                    menu_id: curr.menu_id,
                    permissions: [curr.permission_type],
                  });
                }
                return acc;
              },
              []
            );

            console.log("Grouped Permissions:", groupedPermissions);
            setPermissions(groupedPermissions);
          })
          .catch((error) => {
            console.error("Failed to fetch role permissions:", error);
          });
      }
    }
  }, []);

  const hasPermission = (menuId: number, permissionType: string): boolean => {
    // Cek jika ada global Manage (-1)
    if (
      permissions.some(
        (perm) => perm.menu_id === -1 && perm.permissions.includes("Manage")
      )
    ) {
      return true;
    }

    const found = permissions.find((perm) => perm.menu_id === menuId);
    return (
      !!found &&
      (found.permissions.includes("Manage") ||
        found.permissions.includes(permissionType))
    );
  };

  return { hasPermission, permissions };
};
