import { useState, useEffect } from "react";
import { useRoleStore } from "../API/store/MasterStore/masterRoleStore"; // Pastikan Anda memiliki fungsi ini

export type Permission = {
  menu_id: number;
  permission_type: string;
};

export const usePermission = () => {
  const { fetchRoleById } = useRoleStore();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const role_id = Number(localStorage.getItem("role_id"));

  useEffect(() => {
    if (role_id) {
      if (role_id === 1) {
        // Automatically set "Manage" permission for all menus for role_id 1
        setPermissions([{ menu_id: -1, permission_type: "Manage" }]); // -1 indicates all menus
      } else {
        fetchRoleById(role_id)
          .then((response) => {
            setPermissions(response.permissions || []);
          })
          .catch((error) => {
            console.error("Failed to fetch role permissions:", error);
          });
      }
    }
  }, []);

  const hasPermission = (menuId: number, permissionType: string): boolean => {
    return permissions.some(
      (perm) =>
        (perm.menu_id === -1 && perm.permission_type === "Manage") || // Check for global "Manage" permission
        (perm.menu_id === menuId &&
          (perm.permission_type === "Manage" ||
            perm.permission_type === permissionType))
    );
  };

  return { hasPermission };
};
