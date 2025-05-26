import { create } from "zustand";
import {
  getAllMenus,
  fetchParentMenus,
  createMenu as createMenuSvc,
  deleteMenu as deleteMenuSvc,
  updateMenu as updateMenuSvc,
  Menu,
  MenuPayload,
} from "../../services/MasterServices/MenuService";
import { showErrorToast } from "../../../components/toast";


type Result = { ok: true } | { ok: false; message: string };

interface MenuState {
  menus: Menu[];
  parentMenus: Menu[];
  loading: boolean;
  error: string | null;

  fetchMenus: () => Promise<void>;
  fetchParentMenus: () => Promise<void>;

  createMenu: (data: MenuPayload) => Promise<Result>;
  updateMenu: (id: number, data: Partial<MenuPayload>) => Promise<Result>;
  deleteMenu: (id: number) => Promise<Result>;

  reset: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  parentMenus: [],
  loading: false,
  error: null,

  /* ---------- queries ---------- */
  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllMenus();
      localStorage.setItem("local_menus", JSON.stringify(data));
      set({ menus: data, loading: false });
    } catch (e: any) {
      showErrorToast(e.message);
      set({ error: e.message, loading: false });
    }
  },

  fetchParentMenus: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchParentMenus();
      set({ parentMenus: data, loading: false });
    } catch (e: any) {
      showErrorToast(e.message);

      set({ error: e.message, loading: false });
    }
  },

  /* ---------- commands ---------- */
  createMenu: async (data) => {
    set({ loading: true, error: null });
    try {
      const newMenu = await createMenuSvc(data);
      set((s) => ({ menus: [...s.menus, newMenu], loading: false }));
      return { ok: true };
    } catch (e: any) {
      showErrorToast(e.message);
      set({ error: e.message, loading: false });
      return { ok: false, message: e.message };
    }
  },

  updateMenu: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateMenuSvc(id, data);
      set((s) => ({
        menus: s.menus.map((m) => (m.id === id ? { ...m, ...updated } : m)),
        loading: false,
      }));
      return { ok: true };
    } catch (e: any) {
      showErrorToast(e.message);
      set({ error: e.message, loading: false });
      return { ok: false, message: e.message };
    }
  },

  deleteMenu: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteMenuSvc(id);
      set((s) => ({
        menus: s.menus.filter((m) => m.id !== id),
        loading: false,
      }));
      return { ok: true };
    } catch (e: any) {

      showErrorToast(e.message);
      set({ error: e.message, loading: false });
      return { ok: false, message: e.message };
    }
  },

  reset: () => set({ menus: [], parentMenus: [], loading: false, error: null }),
}));
