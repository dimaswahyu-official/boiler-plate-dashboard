import { useMemo } from "react";
import {
  GridIcon,
  PageIcon,
  DollarLineIcon,
  ListIcon,
  FileIcon,
} from "../icons";
import { useMenuStore } from "../../src/API/store/masterMenuStore";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const iconMap: Record<string, React.ReactNode> = {
  "1": <GridIcon />,
  "2": <PageIcon />,
  "3": <DollarLineIcon />,
  "4": <ListIcon />,
};

const parentNameMap: Record<string, string> = {
  "1": "Master Data",
  "3": "Sales & Distribusi",
  "4": "Report",
};

export const useDynamicSidebarItems = (): NavItem[] => {
  const { menus } = useMenuStore();

  const navItems = useMemo(() => {
    if (!menus || menus.length === 0) return [];

    const groupedByParent: Record<string, typeof menus> = {};
    menus.forEach((item) => {
      if (item.parent_id === "0") return; // Skip Auth
      if (!groupedByParent[item.parent_id]) {
        groupedByParent[item.parent_id] = [];
      }
      groupedByParent[item.parent_id].push(item);
    });

    const priorityGrouped: string[] = ["1", "3", "4"]; // Ordered grouped parent_id
    const items: NavItem[] = [];

    // 1. First render Master, Sales, Report (grouped menus)
    priorityGrouped.forEach((parentId) => {
      const groupItems = groupedByParent[parentId];
      if (groupItems) {
        const subItems = groupItems
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((sub) => ({
            name: sub.name.replace(/([A-Z])/g, " $1").trim(),
            path: sub.path,
          }));

        items.push({
          name: parentNameMap[parentId] || "Other Group",
          icon: iconMap[parentId] || <FileIcon />,
          subItems,
        });

        delete groupedByParent[parentId]; // prevent duplicate
      }
    });

    // 2. Then render everything else (assume it's single pages)
    Object.entries(groupedByParent).forEach(([parentId, groupItems]) => {
      if (parentId === "2") {
        groupItems.forEach((item) => {
          items.push({
            name: item.name.replace(/([A-Z])/g, " $1").trim(),
            icon: iconMap[parentId] || <FileIcon />,
            path: item.path,
          });
        });
      } else {
        // Handle undefined group gracefully
        groupItems.forEach((item) => {
          items.push({
            name: item.name.replace(/([A-Z])/g, " $1").trim(),
            icon: iconMap[parentId] || <FileIcon />,
            path: item.path,
          });
        });
      }
    });

    return items;
  }, [menus]);

  return navItems;
};
