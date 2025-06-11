import { create } from "zustand";
import { fetchAllUser, createUser as createUserService, fetchDetailUser, updateUser } from "../../services/MasterServices/MasterUserService";
import { showErrorToast } from "../../../components/toast";

// Define Role interface
interface Role {
    id: number;
    name: string;
    description: string;
}

// Define base payload structure
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

// Extend BasePayload for Employee-specific data
interface EmployeePayload extends BasePayload {
    employee: {
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

// Extend BasePayload for Salesman-specific data
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

// Union type for all payloads
type FinalPayload = BasePayload | EmployeePayload | SalesmanPayload;

// Define User interface
interface User {
    org_id: any;
    is_sales: any;
    region_name: string;
    employee_number: string;
    branch_region_code: string;
    region_id: number;
    sales_name: string | null;
    id: number;
    salesman_name: string | null;
    salesrep_number: string | null;
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

interface UpdateUser {
    role_id: number;
    branch_id: number;
    region_code: string;
    supervisor_number: string;
    phone: string;
    is_active: boolean;
    is_sales: boolean;
    valid_from: string;
    valid_to: string;
    updated_by: string;
    name: string;
}

// Define the Zustand store interface
interface UserStore {
    user: User[];
    userDetail: User | null; // Add userDetail property
    loading: boolean;
    error: string | null;
    fetchAllUser: () => Promise<{ ok: boolean; message?: string }>;
    createUser: (payload: FinalPayload) => Promise<{ ok: boolean; message?: string }>;
    fetchDetailUser: (
        employee_id: string
    ) => Promise<{ ok: boolean; message?: string; data?: User }>;
    updateUser: (
        employeeId: string,
        payload: UpdateUser
    ) => Promise<{ ok: boolean; message?: string }>;
}

// Zustand store implementation
export const useUserStore = create<UserStore>((set) => ({
    user: [],
    userDetail: null,
    loading: false,
    error: null,

    // Fetch all users
    fetchAllUser: async () => {
        set({ loading: true, error: null });
        try {
            const users = await fetchAllUser();
            set({ user: users, loading: false });
            return { ok: true };
        } catch (err: any) {
            const msg = err.message ?? "Gagal ambil user";
            showErrorToast(msg);
            set({ error: msg, loading: false });
            return { ok: false, message: msg };
        }
    },

    createUser: async (payload) => {
        set({ loading: true, error: null });
        try {

            const filteredPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, value]) => value !== null)
            );            
            
            // await createUserService(payload as unknown as User);
            await createUserService(filteredPayload as unknown as User);
            const users = await fetchAllUser();
            set({ user: users, loading: false });
            return { ok: true };
        } catch (err: any) {
            const msg = err.message ?? "Gagal tambah user";
            showErrorToast(msg);
            set({ error: msg, loading: false });
            return { ok: false, message: msg };
        }
    },

    fetchDetailUser: async (employee_id: string) => {
        set({ loading: true, error: null });
        try {
            const userDetail = await fetchDetailUser(employee_id);
            set({ userDetail });
            return { ok: true, data: userDetail };
        } catch (err: any) {
            const msg = err.message ?? "Gagal ambil detail user";
            showErrorToast(msg);
            set({ error: msg, loading: false });
            return { ok: false, message: msg };
        } finally {
            set({ loading: false });
        }
    },

    updateUser: async (employeeId: string, payload) => {
        set({ loading: true, error: null });

        try {
            // Filter out null values from the payload
            const filteredPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, value]) => value !== null)
            );

            console.log("Filtered Payload store:", filteredPayload);

            await updateUser(employeeId, filteredPayload as UpdateUser);
            const users = await fetchAllUser();
            set({ user: users, loading: false });
            return { ok: true };
        } catch (err: any) {
            const msg = err.message ?? "Gagal update user";
            showErrorToast(msg);
            set({ error: msg, loading: false });
            return { ok: false, message: msg };
        }
    },
}));
