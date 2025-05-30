import axiosInstance from "../AxiosInstance";
import { showErrorToast } from "../../../components/toast";

type Region = {
  region_code: string;
  region_name: string;
  last_update_date: string;
};

interface FetchBranchResponse {
  statusCode: number;
  message: string;
  data: {
    data: Region[];
    count: number;
    status: boolean;
    message: string;
  };
}

export const fetchRegion = async (): Promise<Region[]> => {
  try {
    const response = await axiosInstance.get<FetchBranchResponse>(
      `/region/with-branch`
    );

    if (response.data.statusCode === 200 && response.data.data) {
      return response.data.data.data;
    } else {
      showErrorToast(response.data.message);
      return [];
    }
  } catch (error: any) {
    showErrorToast(
      error.response?.data?.message || "Failed to fetch region data"
    );
    throw error;
  }
};
