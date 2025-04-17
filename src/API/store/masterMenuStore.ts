// stores/postStore.ts
import { create } from 'zustand'
import { createMenus, getAllMenus } from '../services/MenuService'

type PostState = {
  menus: any[]
  menu: any
  loading: boolean
  error: string | null
  fetchMenus: () => Promise<void>
  createMenu: (menuData: any) => Promise<void>
}

export const useMenuStore = create<PostState>(set => ({
  menus: [],
  menu: null,
  loading: false,
  error: null,

  fetchMenus: async () => {
    set({ loading: true, error: null })
    try {
      const data = await getAllMenus()
      set({ menus: data, loading: false })
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  },

  createMenu: async menuData => {
    set({ loading: true, error: null })
    try {
      const newMenu = await createMenus(menuData)
      set(state => ({ menus: [...state.menus, newMenu], loading: false }))
    } catch (err: any) {
      set({ error: err.message, loading: false })
    }
  }
}))
