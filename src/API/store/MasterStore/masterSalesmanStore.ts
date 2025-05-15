import { create } from "zustand";
import { fetchSalesman } from "../../services/MasterServices/MasterSalesmanService";

interface Salesman {
    salesrep_number: string;
    salesrep_name: string | null;
    employee_name: string;
    supervisor_number: string | null;
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
    org_id: string;
    status: string;
    start_date_active: string;
    end_date_active: string | null;
}

interface SalesmanState {
    salesman: Salesman[];
    isLoading: boolean;
    error: string | null;
    fetchSalesman: () => Promise<void>;
}

export const useSalesmanStore = create<SalesmanState>((set) => ({
    salesman: [],
    isLoading: false,
    error: null,

    fetchSalesman: async () => {
        set({ isLoading: true, error: null });
        try {
            const salesman = await fetchSalesman();
            set({ salesman });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to fetch salesman data",
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));