import { create } from 'zustand';
import { fetchAllRole } from '../services/RoleService'

interface MenuState {
    roles: any[];
    loading: boolean;
    error: string | null;
    fetchRole: () => Promise<void>;
    reset: () => void;
}

export const useRoleStore = create<MenuState>((set) => ({
    roles: [],
    loading: false,
    error: null,

    fetchRole: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchAllRole();
            console.log('Roles fetched:', data);

            localStorage.setItem('local_roles', JSON.stringify(data));
            set({ roles: data, loading: false });
        } catch (err: any) {
            console.error('Error fetching roles:', err);
            set({ error: 'Gagal mengambil data menu', loading: false });
        }
    },


    reset: () => {
        set({
            roles: [],
            loading: false,
            error: null,
        });
    },
}));
