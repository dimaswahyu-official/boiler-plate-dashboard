import { create } from "zustand";
import { fetchAllRole, createRole, fetchRoleById, updateRole } from "../services/RoleService";

interface Role {
    id: number;
    name: string;
    description: string;
    permissions: {
        menu_id: number;
        permission_type: string;
    }[];
}

interface RoleStore {
    roles: Role[];
    loading: boolean;
    error: string | null;
    fetchRoles: () => Promise<void>;
    fetchRoleById: (id: number) => Promise<Role>;

    createRole: (payload: {
        name: string;
        description: string;
        permissions: {
            menu_id: number;
            permission_type: string;
        }[];
    }) => Promise<void>;

    updateRole: (
        id: number,
        payload: {
            name: string;
            description: string;
            permissions: {
                menu_id: number;
                permission_type: string;
            }[];
        }
    ) => Promise<void>;
}

export const useRoleStore = create<RoleStore>((set) => ({
    roles: [],
    loading: false,
    error: null,

    fetchRoles: async () => {
        set({ loading: true, error: null });
        try {
            const roles = await fetchAllRole();
            set({ roles, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createRole: async (payload) => {
        set({ loading: true, error: null });
        try {
            await createRole(payload);
            const roles = await fetchAllRole();
            set({ roles, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchRoleById: async (id) => {
        set({ loading: true, error: null });
        try {
            const role = await fetchRoleById(id);
            set({ loading: false });
            return role;
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },


    updateRole: async (id, payload) => {
        set({ loading: true, error: null });
        try {
            await updateRole(id, payload);
            const roles = await fetchAllRole();
            set({ roles, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));