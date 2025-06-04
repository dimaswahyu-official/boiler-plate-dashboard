import { JSX, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import { useAuthStore } from "./API/store/AuthStore/authStore";
import { signOut } from "./utils/SignOut";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { usePagePermissions } from "./utils/UserPermission/UserPagePermissions";

// Pages
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
  DetailCustomer,
  MasterEmployee,
} from "./utils/PagesComponent";
import MasterBranch from "./pages/Master/MasterBranch";
import MasterRegion from "./pages/Master/MasterRegion";
import MasterSalesman from "./pages/Master/MasterSalesman";
import ManagementTerritory from "./pages/Master/ManagementTerritory";
import SelectTerritory from "./pages/Master/ManagementTerritory/selectTerritory";

export function AppRoutes() {
  const navigate = useNavigate();

  const { canView, canCreate, canUpdate, canManage } = usePagePermissions();

  const token = useAuthStore((state) => state.accessToken) || localStorage.getItem("accessToken");

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

  const user_login_menu = (() => {
    const storedUserLogin = localStorage.getItem("user_login_data");
    return storedUserLogin && storedUserLogin !== "undefined"
      ? JSON.parse(storedUserLogin).menus
      : null;
  })();

  console.log("user_login_menu", user_login_menu);
  

  // Map nama komponen dari backend ke komponen React
  const componentMap: Record<string, () => JSX.Element> = {
    SalesRoute: () => <SalesRoute />,
    MasterUser: () => <MasterUser />,
    MasterMenu: () => <MasterMenu />,
    Callplan: () => <Callplan />,
    Roles: () => <MasterRole />,
    Parameters: () => <Parameters />,
    MasterCustomer: () => <MasterCustomer />,
  };


  // Flatten nested menu structure
  const flattenRoutes = (data: any[]): any[] => {
    const result: any[] = [];
    const traverse = (items: any[]) => {
      if (!Array.isArray(items)) return;
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
  

  // ✅ Statis: route yang tidak tergantung API, tetap dibungkus ProtectedRoute
  const staticProtectedRoutes = [
    
    { path: "/master_menu", element: <MasterMenu /> },

    { path: "/master_user", element: <MasterUser /> },

    { path: "/master_role", element: <MasterRole /> },
    { path: "/master_role/create", element: <CreateRole /> },
    { path: "/master_role/update", element: <UpdateRole /> },

    { path: "/management_territory", element: <ManagementTerritory /> },
    { path: "/select_territory", element: <SelectTerritory /> },
    
    { path: "/master_customer", element: <MasterCustomer /> },
    { path: "/detail_customer", element: <DetailCustomer /> },
   
    { path: "/master_branch", element: <MasterBranch /> },

    { path: "/master_region", element: <MasterRegion /> },

    { path: "/master_salesman", element: <MasterSalesman /> },

    { path: "/master_employee", element: <MasterEmployee /> },
    
    { path: "/channel_types", element: <ChannelTypes /> },
    { path: "/payment_types", element: <PaymentTypes /> },
    { path: "/sales_route", element: <RouteManagement /> },
    { path: "/visit_types", element: <VisitTypes /> },
    { path: "/surat_tugas", element: <SuratTugas /> },
  ];

  const renderDynamicRoutes = () => {
    return flattenedRoutes.map((menu: any) => {
      const Component = componentMap[menu.name];
      return Component ? (
        <Route
          key={menu.id}
          path={menu.path}
          element={
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
          }
        />
      ) : null;
    });
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        {isAuthenticated() ? (
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* ✅ Route default */}
            <Route path="/" element={<Callplan />} />

            {/* ✅ Route statis */}
            {staticProtectedRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            ))}

            {/* ✅ Route dinamis dari API */}
            {renderDynamicRoutes()}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/signin" replace />} />
        )}

        {/* ✅ Route publik */}
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}

// import { JSX, useEffect } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import SignIn from "./pages/AuthPages/SignIn";
// // import SignUp from "./pages/AuthPages/SignUp";
// import { useAuthStore } from "./API/store/AuthStore/authStore";
// import { signOut } from "./utils/SignOut";
// // import dummyRoutes from "./helper/dummyRoutes";

// import AppLayout from "./layout/AppLayout";
// import { ScrollToTop } from "./components/common/ScrollToTop";
// import { ProtectedRoute } from "../src/utils/ProtectedRoute";

// import {
//   SalesRoute,
//   MasterUser,
//   MasterMenu,
//   Callplan,
//   MasterRole,
//   CreateRole,
//   UpdateRole,
//   Parameters,
//   ChannelTypes,
//   PaymentTypes,
//   RouteManagement,
//   VisitTypes,
//   MasterCustomer,
//   SuratTugas,
//   DetailCustomer,
//   MasterEmployee,
// } from "./utils/PagesComponent";
// import MasterBranch from "./pages/Master/MasterBranch";
// import MasterRegion from "./pages/Master/MasterRegion";
// import MasterSalesman from "./pages/Master/MasterSalesman";
// import ManagementTerritory from "./pages/Master/ManagementTerritory";
// import SelectTerritory from "./pages/Master/ManagementTerritory/selectTerritory";

// export function AppRoutes() {
//   const navigate = useNavigate();
//   const token =
//     useAuthStore((state) => state.accessToken) ||
//     localStorage.getItem("accessToken");
//   const isAuthenticated = () => {
//     if (token) {
//       localStorage.setItem("accessToken", token);
//       return true;
//     }
//     return false;
//   };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       signOut(navigate);
//     }
//   }, [isAuthenticated, navigate]);

//   const user_login_menu = (() => {
//     const storedUserLogin = localStorage.getItem("user_login_data");
//     return storedUserLogin && storedUserLogin !== "undefined"
//       ? JSON.parse(storedUserLogin).menus
//       : null;
//   })();

//   // const componentMap: Record<string, JSX.Element> = {
//   //   SalesRoute: <SalesRoute />,
//   //   MasterUser: <MasterUser />,
//   //   MasterMenu: <MasterMenu />,
//   //   Callplan: <Callplan />,
//   //   Roles: <MasterRole />,
//   //   Parameters: <Parameters />,
//   //   MasterCustomer: <MasterCustomer />,
//   // };

//   const componentMap: Record<string, () => JSX.Element> = {
//     SalesRoute: () => <SalesRoute />,
//     MasterUser: () => <MasterUser />,
//     MasterMenu: () => <MasterMenu />,
//     Callplan: () => <Callplan />,
//     Roles: () => <MasterRole />,
//     Parameters: () => <Parameters />,
//     MasterCustomer: () => <MasterCustomer />,
//   };

//   const flattenRoutes = (data: any[]) => {
//     const result: any[] = [];
//     const traverse = (items: any[]) => {
//       if (!Array.isArray(items)) return; // Ensure items is an array
//       items.forEach((item) => {
//         result.push(item);
//         if (item.children && item.children.length > 0) {
//           traverse(item.children);
//         }
//       });
//     };
//     traverse(data);
//     return result;
//   };

//   const flattenedRoutes = flattenRoutes(user_login_menu as any[]);

//   const renderDynamicRoutes = () => {
//     if (!Array.isArray(flattenedRoutes) || flattenedRoutes.length === 0) {
//       return null; // Return null if flattenedRoutes is not an array or is empty
//     }

//     return flattenedRoutes.map((menu: any) => {
//       const Component = componentMap[menu.name];
//       return Component ? (
//         <Route
//           key={menu.id}
//           path={menu.path}
//           element={
//             <ProtectedRoute>
//               <Component />
//             </ProtectedRoute>
//           }
//         />
//       ) : null;
//     });
//   };

//   return (
//     <>
//       <ScrollToTop />
//       <Routes>
//         {/* ✅ Protected Routes */}
//         {isAuthenticated() ? (
//           <Route element={<AppLayout />}>
//             <Route path="/" element={<Callplan />} />
//             <Route path="/master_menu" element={<MasterMenu />} />
//             <Route path="/master_role" element={<MasterRole />} />
//             <Route
//               path="/master_user"
//               element={
//                 <ProtectedRoute>
//                   <MasterUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/master_customer" element={<MasterCustomer />} />
//             <Route path="/master_branch" element={<MasterBranch />} />
//             <Route path="/master_region" element={<MasterRegion />} />
//             <Route path="/master_salesman" element={<MasterSalesman />} />
//             <Route path="/master_employee" element={<MasterEmployee />} />

//             <Route
//               path="/management_territory"
//               element={
//                 <ProtectedRoute>
//                   <ManagementTerritory />
//                 </ProtectedRoute>
//               }
//             />

//             <Route path="/create_role" element={<CreateRole />} />
//             <Route path="/update_role" element={<UpdateRole />} />
//             <Route path="/channel_types" element={<ChannelTypes />} />
//             <Route path="/payment_types" element={<PaymentTypes />} />
//             <Route path="/sales_route" element={<RouteManagement />} />
//             <Route path="/visit_types" element={<VisitTypes />} />
//             <Route path="/surat_tugas" element={<SuratTugas />} />
//             <Route path="/detail_customer" element={<DetailCustomer />} />
//             <Route path="/select_territory" element={<SelectTerritory />} />

//             {renderDynamicRoutes()}
//           </Route>
//         ) : (
//           <Route path="*" element={<Navigate to="/signin" replace />} />
//         )}

//         {/* ✅ Public Routes */}
//         <Route path="/signin" element={<SignIn />} />
//       </Routes>
//     </>
//   );
// }
