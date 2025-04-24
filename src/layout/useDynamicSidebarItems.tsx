import { useMemo } from "react";
import {
  FaRegFileAlt,
  FaDollarSign,
  FaFile,
  FaClipboardList,
} from "react-icons/fa";
import { useMenuStore } from "../API/store/menuStore";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

export type MenuItem = {
  id: string | number;
  name: string;
  path?: string;
  order: number;
  parent_id: string | null;
  children?: MenuItem[];
};

const iconMap: Record<string, React.ReactNode> = {
  "2": <FaRegFileAlt />,
  "3": <FaDollarSign />,
  "4": <FaClipboardList />,
};

const parentNameMap: Record<string, string> = {
  "1": "Master Data",
  "3": "Sales & Distribusi",
  "4": "Report",
};

export const useDynamicSidebarItems = (): NavItem[] => {
  const { menus } = useMenuStore();

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

  const navItems = useMemo(() => {
    const effectiveMenus = menus && menus.length > 0 ? menus : localMenus;

    if (!effectiveMenus || effectiveMenus.length === 0) return [];

    return effectiveMenus
      .filter((item) => item.parent_id === null) // Only top-level items
      .sort((a, b) => a.order - b.order)
      .map((parent) => {
        const hasChildren =
          Array.isArray(parent.children) && parent.children.length > 0;

        if (hasChildren) {
            const subItems: { name: string; path: string }[] = parent.children
            .sort((a: MenuItem, b: MenuItem) => a.order - b.order)
            .map((child: MenuItem) => ({
              name: child.name.replace(/([A-Z])/g, " $1").trim(),
              path: child.path || "",
            }));

          return {
            name:
              parentNameMap[parent.id?.toString()] ||
              parent.name.replace(/([A-Z])/g, " $1").trim(),
            icon: iconMap[parent.id?.toString()] || <FaFile />,
            subItems,
          };
        }

        return {
          name: parent.name.replace(/([A-Z])/g, " $1").trim(),
          icon: iconMap[parent.id?.toString()] || <FaFile />,
          path: parent.path || "",
        };
      });
  }, [menus, localMenus]);

  return navItems;
};
