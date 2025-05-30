import { create } from "zustand";
import {
    fetchSalesman,
    Salesman,
    // createSalesman,
    // updateSalesman,
    // deleteSalesman,
    // SalesmanPayload,
} from "../../services/MasterServices/MasterSalesmanService";

interface SalesmanState {
    salesman: Salesman[];
    isLoading: boolean;
    error: string | null;

    /* queries */
    fetchSalesman: () => Promise<void>;

    /* commands */
    // createSalesman: (p: SalesmanPayload) => Promise<Result>;
    // updateSalesman: (id: number, p: Partial<SalesmanPayload>) => Promise<Result>;
    // deleteSalesman: (id: number) => Promise<Result>;
}

export const useSalesmanStore = create<SalesmanState>((set) => ({
    salesman: [],
    isLoading: false,
    error: null,

    /* ---------- queries ---------- */
    fetchSalesman: async () => {
        set({ isLoading: true, error: null });
        try {
            const list = await fetchSalesman();
            set({ salesman: list, isLoading: false });
        } catch (e: any) {
            const message = e?.message || "Gagal memuat data salesman";
            set({ error: message, isLoading: false });
            throw new Error(message); // <- ini penting agar error bisa ditangani di UI
        }
    }


    // /* ---------- commands ---------- */
    // createSalesman: async (payload) => {
    //     set({ isLoading: true, error: null });
    //     try {
    //         const newSls = await createSvc(payload);
    //         set((s) => ({ salesman: [...s.salesman, newSls], isLoading: false }));
    //         return { ok: true };
    //     } catch (e: any) {
    //         set({ error: e.message, isLoading: false });
    //         return { ok: false, message: e.message };
    //     }
    // },

    // updateSalesman: async (id, payload) => {
    //     set({ isLoading: true, error: null });
    //     try {
    //         const upd = await updateSvc(id, payload);
    //         set((s) => ({
    //             salesman: s.salesman.map((v) => (v.salesrep_id === id ? upd : v)),
    //             isLoading: false,
    //         }));
    //         return { ok: true };
    //     } catch (e: any) {
    //         set({ error: e.message, isLoading: false });
    //         return { ok: false, message: e.message };
    //     }
    // },

    // deleteSalesman: async (id) => {
    //     set({ isLoading: true, error: null });
    //     try {
    //         await deleteSvc(id);
    //         set((s) => ({
    //             salesman: s.salesman.filter((v) => v.salesrep_id !== id),
    //             isLoading: false,
    //         }));
    //         return { ok: true };
    //     } catch (e: any) {
    //         set({ error: e.message, isLoading: false });
    //         return { ok: false, message: e.message };
    //     }
    // },
}));
