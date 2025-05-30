import { create } from "zustand";
import { fetchGeotree } from "../../services/MasterServices/MasterGeotreeService";

interface Geotree {
    kecamatan: string;
    kecamatan_code: string;
    kelurahan: string;
    kelurahan_code: string;
    kotamadya: string;
    kotamadya_code: string;
    provinsi: string;
    provinsi_code: string;
}

interface GeotreeState {
    geotrees: Geotree[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    isLoading: boolean;
    error: string | null;
    fetchGeotrees: (
        page: number,
        limit?: number,
        sortBy?: string,
        sortOrder?: string,
        search?: string
    ) => Promise<void>;
}

export const useGeotreeStore = create<GeotreeState>((set) => ({
    geotrees: [],
    totalPages: 0,
    currentPage: 1,
    totalCount: 0,
    isLoading: false,
    error: null,

    fetchGeotrees: async (
        page: number,
        limit = 50,
        sortBy = "",
        sortOrder = "",
        search = ""
    ) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchGeotree(page, limit, sortBy, sortOrder, search);
            set({
                geotrees: response.data,
                totalPages: response.totalPages,
                currentPage: response.currentPage,
                totalCount: response.count,
            });
        } catch (error: any) {
            set({
                error: error?.response?.data?.message ?? "Failed to fetch geotree data",
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));
