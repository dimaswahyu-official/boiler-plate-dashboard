import { create } from "zustand";
import { checkEmployee } from "../../services/MasterServices/MasterEmployeeService";
import { showErrorToast } from "../../../components/toast";

interface Employee {
    employee_id: string;
    employee_name: string;
}

interface BranchState {
    employeeData: Employee[];
    isLoading: boolean;
    error: string | null;
    checkingEmployee: (nik: string) => Promise<void>;
}

export const useCheckEmployee = create<BranchState>((set) => ({
    employeeData: [],
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
}));
