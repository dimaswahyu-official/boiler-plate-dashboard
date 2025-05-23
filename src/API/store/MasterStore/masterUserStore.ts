import { create } from "zustand";
import { fetchAllUser, createUser as createUserService } from "../../services/MasterServices/MasterUserService";

interface Role {
    id: number;
    name: string;
    description: string;
}

interface BasePayload {
    supervisor_number: string;
    email: string;
    name: string;
    employee_id: string | null;
    non_employee: boolean;
    password: string;
    is_active: boolean;
    join_date: string | null;
    valid_from: string;
    valid_to: string | null;
    role_id: number;
    role_name: string;
    branch_id: number;
    region_code: string;
    created_by: string;
    updated_by: string;
}

interface EmployeePayload extends BasePayload {
    employee: {
        employee_id: string;
        employee_number: string;
        employee_name: string;
        flag_salesman: string;
        supervisor_number: string;
        vendor_name: string;
        vendor_num: string;
        vendor_site_code: string;
        vendor_id: number;
        vendor_site_id: number;
        effective_start_date: string;
        effective_end_date: string;
        organization_code: string;
        organization_name: string;
        organization_id: number;
        org_name: string;
        org_id: number;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
    };
}

interface SalesmanPayload extends BasePayload {
    salesman: {
        salesrep_number: string;
        salesrep_name: string;
        employee_name: string;
        supervisor_number: string;
        salesrep_id: number;
        sales_credit_type_id: number;
        subinventory_code: string;
        locator_id: number;
        vendor_name: string;
        vendor_num: string;
        vendor_site_code: string;
        vendor_id: number;
        vendor_site_id: number;
        organization_code: string;
        organization_name: string;
        organization_id: number;
        org_name: string;
        org_id: number;
        status: string;
        start_date_active: string;
        end_date_active: string;
        created_by: string;
        created_at: string;
        updated_by: string;
        updated_at: string;
        deleted_at: string | null;
    };
}

type FinalPayload = BasePayload | EmployeePayload | SalesmanPayload;

interface User {
    id: number;
    email: string;
    username: string;
    role_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_by: string;
    employee_id: string | null;
    is_active: boolean;
    join_date: string | null;
    picture: string;
    updated_by: string;
    valid_from: string;
    valid_to: string | null;
    last_login: string | null;
    phone: string | null;
    user_uuid: string | null;
    branch_id: number | null;
    region_code: string | null;
    non_employee: boolean;
    role_name: string;
    role_description: string;
    organization_name: string | null;
    organization_code: string | null;
    employee_name: string | null;
    supervisor_number: string | null;
    salesrep_name: string | null;
    role: Role;
    branch: any | null;
    employee: any | null;
}

interface UserStore {
    user: User[];
    loading: boolean;
    error: string | null;
    fetchAllUser: () => Promise<void>;
    createUser: (payload: FinalPayload) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    user: [],
    loading: false,
    error: null,

    fetchAllUser: async () => {
        set({ loading: true, error: null });
        try {
            const user = await fetchAllUser(); // Pastikan fetchAllUser mengembalikan User[]
            set({ user, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    createUser: async (payload) => {

        console.log("Payload yang akan dikirim:", payload);

        set({ loading: true, error: null });
        try {
            // Kirim payload ke API
            await createUserService(payload as unknown as User); // Cast FinalPayload to User

            // Refresh data user setelah berhasil membuat user baru
            const user = await fetchAllUser();
            set({ user, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));