import axiosInstance from "./AxiosInstance";
import { showErrorToast, showSuccessToast } from "../../components/toast";

interface Menu {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  order: number;
}

export const getAllMenus = async () => {
  try {
    const res = await axiosInstance.get("/menu");
    showSuccessToast("Menus fetched successfully!");
    return res.data.data;
  } catch (error: any) {
    showErrorToast("Failed to fetch menus.");
    console.error(
      "Failed to fetch menus:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch menus");
  }
};

export const getParentMenu = async () => {
  try {
    const res = await axiosInstance.get("/menu/parent");
    showSuccessToast("Parent menus fetched successfully!");
    return res.data.data;
  } catch (error: any) {
    showErrorToast("Failed to fetch parent menus.");
    console.error(
      "Failed to fetch parent menus:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch parent menus"
    );
  }
};

export const deleteMenu = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`/menu/${id}`);
    showSuccessToast("Menu deleted successfully!");
    return res.data;
  } catch (error: any) {
    showErrorToast("Failed to delete menu.");
    console.error(
      "Failed to delete menu:",
      error.response?.data || error.message,
      "Full error response:",
      error.response
    );
    throw new Error(error.response?.data?.message || "Failed to delete menu");
  }
};

// POST a new menu
export const createMenus = async (menuData: Menu) => {
  try {
    const res = await axiosInstance.post("/menu", menuData);
    showSuccessToast("Menu created successfully!");
    return res.data;
  } catch (error: any) {
    showErrorToast("Failed to create menu.");
    console.error(
      "Failed to create menu:",
      error.response?.data || error.message,
      "Full error response:",
      error.response
    );
    throw new Error(error.response?.data?.message || "Failed to create menu");
  }
};

export const updateMenuById = async (id: number, menuData: Partial<Menu>) => {
  try {
    const res = await axiosInstance.put(`/menu/${id}`, menuData);
    showSuccessToast("Menu updated successfully!");
    return res.data;
  } catch (error: any) {
    showErrorToast("Failed to update menu.");
    console.error(
      "Failed to update menu:",
      error.response?.data || error.message,
      "Full error response:",
      error.response
    );
    throw new Error(error.response?.data?.message || "Failed to update menu");
  }
};
