import { create } from "zustand";
import { fetchBranch } from "../../services/MasterServices/MasterBranchService";
import { showErrorToast } from "../../../components/toast";

interface Branch {
    id: number;
    organization_code: string;
    organization_name: string;
    organization_id: number;
    org_name: string;
    org_id: string;
    organization_type: string;
    region_code: string;
    address: string;
    location_id: number;
    valid_from: string;
    valid_to: string | null;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    deleted_at: string | null;
    region_name: string;
}

interface BranchState {
    branches: Branch[];
    isLoading: boolean;
    error: string | null;
    fetchBranches: () => Promise<void>;
}

export const useBranchStore = create<BranchState>((set) => ({
    branches: [],
    isLoading: false,
    error: null,

    fetchBranches: async () => {
        set({ isLoading: true, error: null });
        try {
            const branches = await fetchBranch();
            set({ branches });
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Failed to fetch branch data";
            showErrorToast(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },
}));
