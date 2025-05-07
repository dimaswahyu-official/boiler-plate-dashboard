import { create } from 'zustand';
import { fetchCustomers } from '../../services/MasterServices/MasterCustomerService';

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
    totalCount: number; // ✅ TAMBAH total count
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


export const useCustomerStore = create<CustomersState>((set, get) => ({
    customers: [],
    totalCount: 0, // ✅
    isLoading: false,
    error: null,

    fetchCustomers: async (
        page,
        limit,
        sortBy,
        sortOrder,
        search
    ) => {

        console.log("Fetching data for page:", page, "with limit:", limit, "sortBy:", sortBy, "sortOrder:", sortOrder, "search:", search);
        console.log("totalCount", get().totalCount);
        

        set({ isLoading: true, error: null });
        try {
            const { customers, totalCount } = await fetchCustomers(
                Number(page),
                Number(limit),
                sortBy?.toString() || '',
                sortOrder || '',
                search || ''
            );
            set({
                customers,
                totalCount, // ✅ simpan totalCount
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || "Failed to fetch customers"
            });
        } finally {
            set({ isLoading: false });
        }
    },

}));
