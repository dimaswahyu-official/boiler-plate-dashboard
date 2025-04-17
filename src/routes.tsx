import { JSX, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// ✅ Import ProtectedRoute
import ProtectedRoute from "./context/ProtectedRoute";
import { useMenuStore } from '../src/API/store/masterMenuStore';

// PAGE MODULES
import Home from "./pages/Dashboard/Home";
import SalesRoute from "./pages/Modules/SalesRoute";
import MasterUser from "./pages/Modules/MasterUser";
import MasterMenu from "./pages/Modules/MasterMenu";
import NotFound from "./pages/OtherPage/NotFound";



export function AppRoutes() {
    const { fetchMenus, menus } = useMenuStore();

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    useEffect(() => {
        console.log('menus', menus);
    }, [menus]);

    const componentMap: Record<string, JSX.Element> = {
        Home: <Home />,
        SalesRoute: <SalesRoute />,
        MasterUser: <MasterUser />,
        MasterMenu: <MasterMenu />,
    };

    const renderDynamicRoutes = () => {
        return menus.map((menu: any) => {
            const Component = componentMap[menu.name];
            return Component ? (
                <Route key={menu.id} path={menu.path} element={Component} />
            ) : null;
        });
    };

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* ✅ Protected Layout dengan token */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        {renderDynamicRoutes()}
                    </Route>
                </Route>

                {/* Auth Routes */}
                <Route path="/" element={<SignIn />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Not Found */}
                <Route path="*" element={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div className="spinner"></div>
                </div>} />
            </Routes>
        </Router>
    );
}
