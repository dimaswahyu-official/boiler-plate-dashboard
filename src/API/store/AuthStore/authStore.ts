import { create } from 'zustand'

interface AuthState {
  token: string | null
  setToken: (token: string) => void
  clearToken: () => void
  resetAuth: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  setToken: token => set({ token }),
  clearToken: () => set({ token: null }),
  resetAuth: () => set({ token: null }) // Fungsi untuk SignOut
}))
