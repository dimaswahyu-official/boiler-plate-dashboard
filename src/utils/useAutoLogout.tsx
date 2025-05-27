import { useEffect } from "react";
import { useAuthStore } from "../API/store/AuthStore/authStore";
import axiosInstance from "../API/services/AxiosInstance";

export function useAutoLogout() {
  const { user, logout, accessToken } = useAuthStore();

  const employee_id = user?.employee_id;

  //   console.log("Auto Logout Hook - User:", user);
  //   console.log("Auto Logout Hook - Access Token:", accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axiosInstance.get(
          `/user/profile/${employee_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        console.log("Fetched user profile for auto logout:", data);

        // if (data.user.last_login !== user?.last_login) {
        //   alert("Anda login di device lain, sesi Anda akan berakhir.");
        //   logout();
        //   window.location.href = "/signin";
        // }
      } catch (error) {
        console.error("Failed to fetch user profile for auto logout", error);
      }
    }, 10000); // cek tiap 10 detik, sesuaikan kebutuhan

    return () => clearInterval(interval);
  }, [accessToken, user, logout]);
}
