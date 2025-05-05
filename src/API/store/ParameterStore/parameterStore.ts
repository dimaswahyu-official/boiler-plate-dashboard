import { create } from 'zustand';
import { createParameter, fetchParameter, updateParameter } from '../../services/ParameterServices/ParameterService';

interface ParameterState {
    isLoading: boolean;
    error: string | null;
    parameters: any | null;
    createParameter: (data: any) => Promise<void>;
    fetchParameter: (key: string) => Promise<void>;
    updateParameter: (payload: any, id: string | number) => Promise<void>;

}

export const useParametersStore = create<ParameterState>((set) => ({
    isLoading: false,
    error: null,
    parameters: null,

    createParameter: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await createParameter(data);
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchParameter: async (key) => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchParameter(key);
            set({ parameters: data });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateParameter: async (payload: any, id: string | number) => {
        set({ isLoading: true, error: null });
        try {
            const data = await updateParameter(payload, Number(id));
            console.log("Response from updateParameter:", data);
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
