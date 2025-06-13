import { JSX } from "react";
import { useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const storedUserLogin = localStorage.getItem("user_login_data");
  const userMenus = storedUserLogin && storedUserLogin !== "undefined"  ? JSON.parse(storedUserLogin).menus : [];

  // Ambil semua path termasuk child manual
  const flattenPaths = (menus: any[]): string[] => {
    const paths: string[] = [];
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        if (item.path) paths.push(item.path);
        if (item.children?.length) traverse(item.children);
      });
    };
    traverse(menus);
    return paths;
  };

  const allowedPaths = flattenPaths(userMenus);

  const hasAccess = allowedPaths.some(
    (path) => currentPath === path || currentPath.startsWith(path + "/")
  );

  if (!hasAccess) {
    return (
      <div className="text-center mt-10 text-red-600 font-bold">
        Anda tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return children;
}
