import { create } from "zustand";
import { fetchAllUser, createUser } from "../services/MasterUserService";
import { showErrorToast, showSuccessToast } from "../../components/toast";


interface User {
    name: string;
    role: string;
    branch: string;
    create_on: string;
    id: any;
    user_uuid: string;
    created_at: string;
    email: string;
    username: string;
    employee_id: string;
    password: string;
    picture: string;
    is_active: boolean;
    join_date: string;
    valid_from: string;
    valid_to: string;
    role_id: number;
    created_by: string;
    updated_by: string;
    branch_id: number;
}

interface UserStore {
    user: User[];
    loading: boolean;
    error: string | null;
    fetchAllUser: () => Promise<void>;

    createUser: (payload: {
        name: string;
        email: string;
        username: string;
        employee_id: string;
        password: string;
        picture: string;
        is_active: boolean;
        join_date: string;
        valid_from: string;
        valid_to: string;
        role_id: number;
        created_by: string;
        updated_by: string;
    }) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    user: [],
    loading: false,
    error: null,

    fetchAllUser: async () => {
        set({ loading: true, error: null });
        try {
            const user = await fetchAllUser();
            set({ user, loading: false });
        } catch (error: any) {
            showErrorToast(error.message);
            set({ error: error.message, loading: false });
        }
    },

    createUser: async (payload) => {
        set({ loading: true, error: null });
        try {
            await createUser(payload);
            const user = await fetchAllUser();
            set({ user, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },


}));