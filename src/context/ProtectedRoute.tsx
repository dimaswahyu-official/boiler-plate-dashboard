import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../API/store/authStore";

export default function ProtectedRoute() {
    const token = useAuthStore((state) => state.token) || localStorage.getItem("token");
    // console.log('token  : ', token);

    // Jika token tidak ada, arahkan ke halaman signin
    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    // Jika token ada, render konten dalam Outlet (alias AppLayout dan semua anaknya)
    return <Outlet />;
}
