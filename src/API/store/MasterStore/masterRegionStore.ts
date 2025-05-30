import { create } from "zustand";
import { showErrorToast } from "../../../components/toast";
import { fetchRegion } from "../../services/MasterServices/MasterRegionService";

type Region = {
    region_code: string;
    region_name: string;
    last_update_date: string;
};

interface RegionState {
    regions: Region[];
    isLoading: boolean;
    error: string | null;
    fetchRegion: () => Promise<void>;
}

export const useRegionStore = create<RegionState>((set) => ({
    regions: [],
    isLoading: false,
    error: null,

    fetchRegion: async () => {
        set({ isLoading: true, error: null });
        try {
            const regions = await fetchRegion();
            
            set({ regions });
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Failed to fetch region data";
            showErrorToast(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },
}));
