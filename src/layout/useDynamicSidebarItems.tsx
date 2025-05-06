import { useMemo } from "react";
import * as Icons from "react-icons/fa"; // Import semua ikon dari react-icons/fa
import dummyRoutes from "../helper/dummyRoutes";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

export type MenuItem = {
  icon: string; // Pastikan kolom icon adalah string
  id: string | number;
  name: string;
  path?: string;
  order: number;
  parent_id: string | null;
  children?: MenuItem[];
};

// Fungsi untuk membangun hierarki menu berdasarkan id dan parent_id
const buildMenuHierarchy = (menuItems: MenuItem[]): MenuItem[] => {
  const menuMap: { [key: string]: MenuItem } = {};

  // Buat map dari menu berdasarkan id
  menuItems.forEach((menu) => {
    menuMap[menu.id] = { ...menu, children: [] };
  });

  const rootMenus: MenuItem[] = [];

  // Hubungkan parent dan children
  menuItems.forEach((menu) => {
    if (menu.parent_id) {
      const parent = menuMap[menu.parent_id];
      if (parent) {
        parent.children?.push(menuMap[menu.id]);
      }
    } else {
      rootMenus.push(menuMap[menu.id]); // Menu tanpa parent_id menjadi root
    }
  });

  return rootMenus;
};

export const useDynamicSidebarItems = (): NavItem[] => {

  const localMenus: MenuItem[] = useMemo(() => {
    const storedMenus = localStorage.getItem("local_menus");
    try {
      return storedMenus && storedMenus !== "undefined"
        ? JSON.parse(storedMenus)
        : [];
    } catch {
      console.warn("Failed to parse local_menus from localStorage.");
      return [];
    }
  }, []);

  const user_login_menu = (() => {
    const storedUserLogin = localStorage.getItem("user_login_data");
    return storedUserLogin && storedUserLogin !== "undefined"
      ? JSON.parse(storedUserLogin).menus
      : null;
  })();

  const navItems = useMemo(() => {
    const effectiveMenus =
      user_login_menu && user_login_menu.length > 0
        ? user_login_menu
        : localMenus;

    if (!effectiveMenus || effectiveMenus.length === 0) return [];

    // Bangun hierarki menu
    // const menuHierarchy = buildMenuHierarchy(effectiveMenus);
    const menuHierarchy = buildMenuHierarchy(dummyRoutes as MenuItem[]);


    // Proses hierarki menu menjadi NavItem
    const processedNavItems = menuHierarchy.map((parent: MenuItem): NavItem => {
      const resolveIcon = (iconName: string): React.ReactNode => {
        const IconComponent = Icons[iconName as keyof typeof Icons];
        return IconComponent ? <IconComponent /> : <Icons.FaFile />;
      };

      // Jika menu tidak memiliki children, jadikan menu tunggal
      if (!parent.children || parent.children.length === 0) {
        return {
          name: parent.name.replace(/([A-Z])/g, " $1").trim(),
          icon: resolveIcon(parent.icon),
          path: parent.path || "",
        };
      }

      // Jika menu memiliki children, jadikan menu dengan dropdown
      const subItems = parent.children.map((child) => ({
        name: child.name.replace(/([A-Z])/g, " $1").trim(),
        path: child.path || "",
      }));

      return {
        name: parent.name.replace(/([A-Z])/g, " $1").trim(),
        icon: resolveIcon(parent.icon),
        path: parent.path || "",
        subItems,
      };
    });

    // Urutkan menu: yang memiliki children di atas
    return processedNavItems.sort((a, b) => {
      const aHasChildren = a.subItems && a.subItems.length > 0;
      const bHasChildren = b.subItems && b.subItems.length > 0;
      return aHasChildren === bHasChildren ? 0 : aHasChildren ? -1 : 1;
    });
  }, [localMenus]);

  return navItems;
};
