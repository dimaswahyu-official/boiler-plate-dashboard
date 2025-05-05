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
  authLogin: (data: LoginPayload) => Promise<void>;
}

interface LoginPayload {
  email: string;
  password: string;
  ip_address: string;
  device_info: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  employee_id: string;
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
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  menus: null,

  authLogin: async (data: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginService(data);
      const { accessToken, refreshToken, user, menus } = response.data;
      // Simpan data hasil login ke state
      set({
        accessToken,
        refreshToken,
        user,
        menus,
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
    });
  },
}));
