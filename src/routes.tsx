import { JSX, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import { useAuthStore } from "./API/store/AuthStore/authStore";
import { signOut } from "./utils/SignOut";
// import dummyRoutes from "./helper/dummyRoutes";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import {
  SalesRoute,
  MasterUser,
  MasterMenu,
  Callplan,
  MasterRole,
  CreateRole,
  UpdateRole,
  Parameters,
  ChannelTypes,
  PaymentTypes,
  RouteManagement,
  VisitTypes,
  MasterCustomer,
  SuratTugas,
  DetailCustomer
} from "./utils/PagesComponent";
import MasterBranch from "./pages/Master/MasterBranch";
import MasterRegion from "./pages/Master/MasterRegion";


export function AppRoutes() {
  const navigate = useNavigate();
  const token =
    useAuthStore((state) => state.accessToken) ||
    localStorage.getItem("accessToken");
  const isAuthenticated = () => {
    if (token) {
      localStorage.setItem("accessToken", token); // Persist token
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // Jika tidak terautentikasi, panggil fungsi signOut
      signOut(navigate);
    }
  }, [isAuthenticated, navigate]);

  // const local_menus = (() => {
  //   const storedMenus = localStorage.getItem("local_menus");
  //   return storedMenus && storedMenus !== "undefined"
  //     ? JSON.parse(storedMenus)
  //     : [];
  // })();

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
    Parameters: <Parameters />,
    MasterCustomer: <MasterCustomer />,
  };

  const flattenRoutes = (data: any[]) => {
    const result: any[] = [];
    const traverse = (items: any[]) => {
      if (!Array.isArray(items)) return; // Ensure items is an array
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

  const flattenedRoutes = flattenRoutes(user_login_menu as any[]);
  

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

  // const renderDummyRoutes = () => {
  //   if (!Array.isArray(dummyRoutes) || dummyRoutes.length === 0) {
  //     return null; // Return null if dummyRoutes is not an array or is empty
  //   }

  //   return dummyRoutes.map((menu: any) => {
  //     const Component = componentMap[menu.name];
  //     return Component ? (
  //       <Route key={menu.id} path={menu.path} element={Component} />
  //     ) : null;
  //   });
  // };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ✅ Protected Routes */}
        {isAuthenticated() ? (
          <Route element={<AppLayout />}>
            <Route path="/" element={<Callplan />} />
            <Route path="/master_menu" element={<MasterMenu />} />
            <Route path="/master_role" element={<MasterRole />} />
            <Route path="/master_user" element={<MasterUser />} />
            <Route path="/master_customer" element={<MasterCustomer />} />
            <Route path="/master_branch" element={<MasterBranch />} />
            <Route path="/master_region" element={<MasterRegion />} />


            <Route path="/create_role" element={<CreateRole />} />
            <Route path="/update_role" element={<UpdateRole />} />
            <Route path="/channel_types" element={<ChannelTypes />} />
            <Route path="/payment_types" element={<PaymentTypes />} />
            <Route path="/sales_route" element={<RouteManagement />} />
            <Route path="/visit_types" element={<VisitTypes />} />
            <Route path="/surat_tugas" element={<SuratTugas />} />
            <Route path="/detail_customer" element={<DetailCustomer />} />

            {renderDynamicRoutes()}

            {/* {renderDummyRoutes()} */}
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
