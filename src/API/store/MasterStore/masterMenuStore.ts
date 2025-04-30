import { create } from 'zustand';
import { createMenus, getAllMenus, getParentMenu, deleteMenu, updateMenuById } from '../../services/MasterServices/MenuService'

interface MenuState {
  menus: any[];
  parentMenus: any[];
  loading: boolean;
  error: string | null;
  fetchMenus: () => Promise<void>;
  getParentMenu: () => Promise<void>;
  createMenu: (menuData: any) => Promise<void>;
  deleteMenu: (id: number) => Promise<void>;
  updateMenuById: (id: number, menuData: any) => Promise<void>;
  reset: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menus: [],
  parentMenus: [],
  loading: false,
  error: null,

  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllMenus();
      localStorage.setItem('local_menus', JSON.stringify(data));
      set({ menus: data, loading: false });
    } catch (err: any) {
      console.error('Error fetching menus:', err);
      set({ error: 'Gagal mengambil data menu', loading: false });
    }
  },

  getParentMenu: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getParentMenu();
      set({ parentMenus: data, loading: false });
    } catch (err: any) {
      console.error('Error fetching menus:', err);
      set({ error: 'Gagal mengambil data parent menu', loading: false });
    }
  },

  createMenu: async (menuData) => {
    set({ loading: true, error: null });
    try {
      const newMenu = await createMenus(menuData);
      set((state) => ({
        menus: [...state.menus, newMenu],
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error creating menu:', err);
      set({ error: err.message || 'Gagal membuat menu', loading: false });
    }
  },

  deleteMenu: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteMenu(id);
      set((state) => ({
        menus: state.menus.filter((menu) => menu.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error deleting menu:', err);
      set({ error: err.message || 'Gagal menghapus menu', loading: false });
    }
  },


  updateMenuById: async (id, menuData) => {
    set({ loading: true, error: null });
    try {
      const updatedMenu = await updateMenuById(id, menuData);
      set((state) => ({
        menus: state.menus.map((menu) =>
          menu.id === id ? { ...menu, ...updatedMenu } : menu
        ),
        loading: false,
      }));
    } catch (err: any) {
      console.error('Error updating menu:', err);
      set({ error: err.message || 'Gagal memperbarui menu', loading: false });
    }
  },


  reset: () => {
    set({
      menus: [],
      parentMenus: [],
      loading: false,
      error: null,
    });
  },
}));
