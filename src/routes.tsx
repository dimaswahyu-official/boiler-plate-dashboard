import { JSX, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";

import { signOut } from "./utils/SignOut";
import { ScrollToTop } from "./components/common/ScrollToTop";


// ✅ Pages
import {
  MasterMenu,
  MasterRole,
  CreateRole,
  UpdateRole,
  Parameters,
  ChannelTypes,
  PaymentTypes,
  VisitTypes,
  SuratTugas,
  MasterUser,
  SalesRoute,
} from "./utils/PagesComponent";
import dummyRoutes from "./helper/dummyRoutes";
import Inbound from "./pages/Inbound/Inbound.tsx";

const DefaultPage: React.FC = () => {
  return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Halaman ini masih dalam proses development</h1>
      </div>
  );
};

export function AppRoutes() {
  const navigate = useNavigate();
  // const token = useAuthStore((state) => state.accessToken) || localStorage.getItem("accessToken");
  const token = "abcdefghijklmnopqrstuvwxyz"; // Simulasi token, ganti dengan logika autentikasi yang sesuai

  const isAuthenticated = () => {
    if (token) {
      localStorage.setItem("accessToken", token);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      signOut(navigate);
    }
  }, [navigate]);

  // const storedUserLogin = localStorage.getItem("user_login_data");
  // const userMenus =
  //     storedUserLogin && storedUserLogin !== "undefined"
  //         ? JSON.parse(storedUserLogin).menus
  //         : [];

  // 📌 Child route manual untuk parent tertentu
  const manualChildRoutes: Record<
      string,
      { path: string; element: JSX.Element }[]
  > = {
    "/master_role": [
      { path: "create", element: <CreateRole /> },
      { path: "update", element: <UpdateRole /> },
    ],


  };

  // Gabungkan user menu + manual child
  const buildRoutes = (menus: any[]) => {
    const routes: { id: string; path: string; element: JSX.Element }[] = [];

    const traverse = (items: any[]) => {
      items.forEach((item) => {
        if (item.path) {
          const Element = getElementByPath(item.path);
          if (Element) {
            routes.push({
              id: item.id || item.path,
              path: item.path,
              element: Element,
            });
          }

          const childRoutes = manualChildRoutes[item.path];
          if (childRoutes) {
            childRoutes.forEach((child) => {
              routes.push({
                id: `${item.path}-${child.path}`,
                path: `${item.path}/${child.path}`,
                element: child.element,
              });
            });
          }

          if (item.children?.length) traverse(item.children);
        }
      });
    };

    traverse(menus);
    return routes;
  };

  const getElementByPath = (path: string): JSX.Element | null => {
    const map: Record<string, JSX.Element> = {
      "/sales_route": <SalesRoute />,
      "/master_user": <MasterUser />,
      "/master_menu": <MasterMenu />,

      "/master_role": <MasterRole />,

      "/parameters": <Parameters />,
      "/channel_types": <ChannelTypes />,
      "/payment_types": <PaymentTypes />,
      "/visit_types": <VisitTypes />,
      "/surat_tugas": <SuratTugas />,

      "/inbound_planning": <Inbound />,
    };

    return map[path] || <DefaultPage />;
  };

  // const userRoutes = buildRoutes(userMenus);
  const userRoutes = buildRoutes(dummyRoutes);


  return (
      <>
        <ScrollToTop />
        <Routes>
          {isAuthenticated() ? (
              <Route
                  element={
                    // <ProtectedRoute>
                    <AppLayout />
                    // </ProtectedRoute>
                  }
              >
                <Route path="/" element={<SignIn />} />

                {userRoutes.map((route) => (
                    <Route
                        key={route.id}
                        path={route.path}
                        element={route.element}
                        // element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                    />
                ))}
              </Route>
          ) : (
              <Route path="*" element={<Navigate to="/signin" replace />} />
          )}
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </>
  );
}
