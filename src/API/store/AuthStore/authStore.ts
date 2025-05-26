import { create } from 'zustand';
import { loginService } from '../../services/AuthServices/AuthService';

interface AuthState {
  resetAuth: any;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  menus: Menu[] | null;
  permissions: Permission[] | null; // Tambahkan ini
  authLogin: (data: LoginPayload) => Promise<void>;
}

interface LoginPayload {
  employee_id: string;
  password: string;
  ip_address: string;
  device_info: string;
}

interface User {
  id: number;
  employee_id: string;
  username: string;
  picture: string;
  role_id: number;
}

interface Menu {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  order: number;
  created_at: string;
  updated_at: string;
  permissions: Permission[]; // Tambahkan ini
}

interface Permission {
  id: number;
  role_id: number;
  menu_id: number;
  permission_type: string;
  created_at: string;
  updated_at: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  menus: null,
  permissions: null,

  authLogin: async (data: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginService(data);
      const { accessToken, refreshToken, user, menus } = response.data;

      // Ekstrak permissions dari menus
      const permissions = menus.flatMap((menu: Menu) => menu.permissions);

      // Simpan data hasil login ke state
      set({
        accessToken,
        refreshToken,
        user,
        menus,
        permissions,
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  resetAuth: () => {
    set({
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
      user: null,
      menus: null,
      permissions: null,
    });
  },
}));
