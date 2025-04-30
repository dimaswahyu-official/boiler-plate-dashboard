import { create } from "zustand";
import { fetchAllRole, createRole, getRoleById, updateRole, deleteRole } from "../../services/MasterServices/RoleService";

interface Role {
    data?: any;
    id: number;
    name: string;
    description: string;
    permissions: {
        menu_id: number;
        permission_type: string;
    }[];
    // data?: any; // Make 'data' optional to align with the returned object
}

interface RoleStore {
    roles: Role[];
    loading: boolean;
    error: string | null;
    fetchRoles: () => Promise<void>;
    fetchRoleById: (id: number) => Promise<Role>;
    deleteRole: (id: number) => Promise<void>;

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
            const role = await getRoleById(id);
            set({ loading: false });
            return role; // Ensure the fetched role is returned
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

    deleteRole: async (id) => {
        set({ loading: true, error: null });
        try {
            const role = await deleteRole(id);
            const roles = await fetchAllRole();
            set({ roles, loading: false });
            return role; // Ensure the deleted role is returned
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },
}));