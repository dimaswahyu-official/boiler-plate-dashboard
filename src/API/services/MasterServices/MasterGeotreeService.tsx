import axiosInstance from "../AxiosInstance";
import { showErrorToast } from "../../../components/toast";

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

interface FetchGeotreeResponse {
  data: Geotree[];
  totalPages: number;
  currentPage: number;
  count: number;
}

let abortController: AbortController | null = null;

export const fetchGeotree = async (
  page: number,
  limit: number,
  sortBy?: string,
  sortOrder?: string,
  search?: string
): Promise<FetchGeotreeResponse> => {
  try {
    // Abort request sebelumnya (jika masih berjalan)
    if (abortController) {
      abortController.abort();
    }

    // Buat request baru
    abortController = new AbortController();

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);
    if (search) queryParams.append("search", search);

    const response = await axiosInstance.get(
      `/geotree/all?${queryParams.toString()}`,
      {
        signal: abortController.signal, // ← penting
      }
    );

    const apiData = response.data.data;

    return {
      data: apiData.data,
      totalPages: apiData.totalPages,
      currentPage: apiData.currentPage,
      count: apiData.count,
    };
  } catch (error: any) {
    // Cegah toast jika request dibatalkan (normal)
    if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
      console.log("Request aborted");
      return Promise.reject(); // atau bisa return null
    }

    showErrorToast(
      error.response?.data?.message || "Failed to fetch geotree data"
    );
    throw error;
  }
};
