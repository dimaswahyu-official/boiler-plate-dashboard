import { create } from "zustand";
import { fetchCustomers } from "../../services/MasterServices/MasterCustomerService";

interface Address {
    id: number;
    customer_id: number;
    address1: string;
    provinsi: string;
    kab_kodya: string;
    kecamatan: string;
    kelurahan: string | null;
    kodepos: string | null;
    latitude: string;
    longitude: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
}

interface Customer {
    id: number;
    name: string;
    alias: string | null;
    owner: string | null;
    phone: string | null;
    npwp: string | null;
    ktp: string | null;
    channel: string;
    customer_number: string;
    cust_account_id: number;
    bill_to_location: string;
    ship_to_location: string;
    order_type_name: string | null;
    order_type_id: string | null;
    return_order_type_name: string | null;
    return_order_type_id: string | null;
    site_type: string;
    bill_to_site_use_id: number;
    ship_to_site_use_id: number;
    site_use_id: string;
    credit_checking: string | null;
    credit_exposure: string;
    overall_credit_limit: string;
    trx_credit_limit: string;
    term_name: string;
    term_id: number;
    term_day: number;
    price_list_name: string;
    price_list_id: number;
    organization_code: string;
    organization_name: string;
    organization_id: number;
    org_name: string;
    org_id: string;
    is_active: boolean;
    is_stockist: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    deleted_at: string | null;
    addresses: Address[];
}

interface CustomersState {
    customers: Customer[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    isLoading: boolean;
    error: string | null;
    fetchCustomers: (
        page: number,
        limit?: number,
        sortBy?: string,
        sortOrder?: string,
        search?: string
    ) => Promise<void>;
}

export const useCustomerStore = create<CustomersState>((set) => ({
    customers: [],
    totalPages: 0,
    currentPage: 1,
    totalCount: 0,
    isLoading: false,
    error: null,

    fetchCustomers: async (
        page: number,
        limit = 50,
        sortBy = "",
        sortOrder = "",
        search = ""
    ) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchCustomers(page, limit, sortBy, sortOrder, search);
            set({
                customers: response.data,
                totalPages: response.totalPages,
                currentPage: response.currentPage,
                totalCount: response.count,
            });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message ?? "Failed to fetch customers",
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));