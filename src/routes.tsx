import { JSX, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// PAGE MODULES
import SalesRoute from "./pages/SalesDistribution/SalesRoute";
import MasterUser from "./pages/Master/MasterUser";
import MasterMenu from "./pages/Master/MasterMenu";
import Callplan from "./pages/Callplan";

// ROLES PAGE
import MasterRole from "./pages/Master/MasterRole";
import CreateRole from "./pages/Master/MasterRole/Screen/CreateRole";
import UpdateRole from "./pages/Master/MasterRole/Screen/UpdateRole";

// ✅ Import ProtectedRoute
import { useMenuStore } from "./API/store/menuStore";

export function AppRoutes() {
  const { menus } = useMenuStore();
  const isAuthenticated = () => !!localStorage.getItem("token");

  const local_menus = (() => {
    const storedMenus = localStorage.getItem("local_menus");
    return storedMenus && storedMenus !== "undefined"
      ? JSON.parse(storedMenus)
      : [];
  })();

  const user_login_menu = (() => {
    const storedUserLogin = localStorage.getItem("user_login_data");
    return storedUserLogin && storedUserLogin !== "undefined"
      ? JSON.parse(storedUserLogin).menus
      : null;
  })();

  const componentMap: Record<string, JSX.Element> = {
    SalesRoute: <SalesRoute />,
    MasterUser: <MasterUser />,
    MasterMenu: <MasterMenu />,
    Callplan: <Callplan />,
    Roles: <MasterRole />,
  };

  const flattenRoutes = (data: any[]) => {
    const result: any[] = [];
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(data);
    return result;
  };

  const flattenedRoutes = flattenRoutes(
    (user_login_menu && user_login_menu.length > 0
      ? user_login_menu
      : local_menus) as any[]
  );

  const renderDynamicRoutes = () => {
    if (!Array.isArray(flattenedRoutes) || flattenedRoutes.length === 0) {
      return null; // Return null if flattenedRoutes is not an array or is empty
    }

    return flattenedRoutes.map((menu: any) => {
      const Component = componentMap[menu.name];
      return Component ? (
        <Route key={menu.id} path={menu.path} element={Component} />
      ) : null;
    });
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ✅ Protected Routes */}
        {isAuthenticated() ? (
          <Route element={<AppLayout />}>
            <Route path="/" element={<Callplan />} />
            <Route path="/create_role" element={<CreateRole />} />
            <Route path="/update_role" element={<UpdateRole />} />
            {renderDynamicRoutes()}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/signin" replace />} />
        )}

        {/* ✅ Public Routes */}
        <Route
          path="/signin"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <SignUp />}
        />
      </Routes>
    </>
  );
}
