// src/API/services/MasterServices/MenuService.ts
import axiosInstance from "../AxiosInstance";

export interface Menu {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  order: number;
}

export type MenuPayload = Omit<Menu, "id">;

/* helper */
const assert200 = (status: number, msg = "Request failed") => {
  if (status !== 200) throw new Error(msg);
};

/* ---------- queries ---------- */
export const getAllMenus = async (): Promise<Menu[]> => {
  const { data } = await axiosInstance.get("/menu");  
  assert200(data.statusCode ?? 200, data.message);
  return data.data;
};

export const fetchParentMenus = async (): Promise<Menu[]> => {
  const { data } = await axiosInstance.get("/menu/parent");
  assert200(data.statusCode ?? 200, data.message);
  return data.data;
};

/* ---------- commands ---------- */
export const createMenu = async (payload: MenuPayload) => {
  const { data } = await axiosInstance.post("/menu", payload);
  assert200(data.statusCode, data.message);
  return data.data; // ← data menu baru
};

export const updateMenu = async (id: number, payload: Partial<MenuPayload>) => {
  const { data } = await axiosInstance.put(`/menu/${id}`, payload);
  assert200(data.statusCode, data.message);
  return data.data; // ← data menu hasil update
};

export const deleteMenu = async (id: number) => {
  const { data } = await axiosInstance.delete(`/menu/${id}`);
  assert200(data.statusCode, data.message);
  return data.data; // ← data menu terhapus (opsional)
};
