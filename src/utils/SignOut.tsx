import { NavigateFunction } from "react-router-dom";
import { useMenuStore } from "../API/store/menuStore";
import { useAuthStore } from "../API/store/authStore";



export const signOut = (navigate: NavigateFunction) => {
  // Hapus semua data yang tersimpan di localStorage
  localStorage.clear();
  useMenuStore.getState().reset();
  useAuthStore.getState().resetAuth();

  // Navigasi ke halaman SignIn
  navigate("/signin");
};
