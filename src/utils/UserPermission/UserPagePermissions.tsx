import { usePermission } from "./usePermision";
import { getMenuIdByPath } from "./GetMenuId";
import { useLocation } from "react-router-dom";

export const usePagePermissions = () => {
  const { hasPermission } = usePermission();
  const location = useLocation();

  // Dapatkan menuId berdasarkan path halaman saat ini
  const menuId = getMenuIdByPath(location.pathname);  
  
  const canCreate = menuId ? hasPermission(menuId, "Create") : false;
  const canUpdate = menuId ? hasPermission(menuId, "Update") : false;
  const canDelete = menuId ? hasPermission(menuId, "Delete") : false;
  const canView = menuId ? hasPermission(menuId, "View") : false;
  const canManageDirect = menuId ? hasPermission(menuId, "Manage") : false;

  const canManage = canManageDirect || (canCreate && canUpdate && canDelete && canView);

  return {
    canCreate,
    canUpdate,
    canDelete,
    canView,
    canManage,
    menuId,
  };
};
