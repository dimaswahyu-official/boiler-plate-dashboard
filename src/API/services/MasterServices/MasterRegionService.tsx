import axiosInstance from "../AxiosInstance";
import { showErrorToast } from "../../../components/toast";

type Region = {
  id: number;
  region_code: string;
  region_name: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  deleted_at: string | null;
};

interface ApiResponse {
  statusCode: number;
  message: string;
  data: Region[]; // Perbaikan: `data` adalah array `Region[]`
}

export const fetchRegion = async (): Promise<Region[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse>("/region/all");
    const apiResponse = response.data;
    if (apiResponse.statusCode === 200) {
      return apiResponse.data; // Tidak ada error karena tipe sudah sesuai
    }
    showErrorToast(apiResponse.message || "No region data found");
    return [];
  } catch (error: any) {
    showErrorToast(
      error.response?.data?.message || "Failed to fetch region data"
    );
    throw error;
  }
};
