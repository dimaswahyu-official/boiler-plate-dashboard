import { create } from "zustand";
import { checkEmployee, fetchAllEmployees } from "../../services/MasterServices/MasterEmployeeService";
import { showErrorToast } from "../../../components/toast";

interface Employee {
    employee_id: string;
    employee_name: string;
}

interface EmployeeData {
    salesrep_id: string | null;
    sales_credit_type_id: string | null;
    subinventory_code: string | null;
    locator_id: string | null;
    employee_number: string;
    employee_name: string;
    flag_salesman: string;
    supervisor_number: string | null;
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
    effective_start_date: string;
    effective_end_date: string;
    status: any;
}

interface BranchState {
    employeeData: Employee[];
    allEmployees: EmployeeData[]; // Menyimpan semua data karyawan
    isLoading: boolean;
    error: string | null;
    checkingEmployee: (nik: string) => Promise<void>;
    fetchAllEmployees: () => Promise<void>; // Fungsi untuk fetch semua karyawan
}

export const useEmployeeStore = create<BranchState>((set) => ({
    employeeData: [],
    allEmployees: [], // Inisialisasi state untuk semua karyawan
    isLoading: false,
    error: null,

    checkingEmployee: async (nik: string) => {
        set({ isLoading: true, error: null });
        try {
            const employee = await checkEmployee(nik);
            set({ employeeData: employee });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch employee", isLoading: false });
            showErrorToast(error.message || "Failed to fetch employee");
        }
    },

    fetchAllEmployees: async () => {
        set({ isLoading: true, error: null });
        try {
            const employees = await fetchAllEmployees();
            console.log("Fetched employees:", employees);

            set({ allEmployees: employees });
        } catch (error: any) {
            set({ error: error.message || "Failed to fetch all employees", isLoading: false });
            showErrorToast(error.message || "Failed to fetch all employees");
        } finally {
            set({ isLoading: false });
        }
    },
}));