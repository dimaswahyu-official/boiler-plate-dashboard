import axiosInstance from "../AxiosInstance";
import { showErrorToast } from "../../../components/toast";

interface Branch {
  id: number;
  organization_code: string;
  organization_name: string;
  organization_id: number;
  org_name: string;
  org_id: string;
  organization_type: string;
  region_code: string;
  address: string;
  location_id: number;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  deleted_at: string | null;
  region_name: string;
}

interface FetchBranchResponse {
  statusCode: number;
  message: string;
  data: [];
}

export const fetchBranch = async (): Promise<Branch[]> => {

  try {
    const response = await axiosInstance.get<FetchBranchResponse>(
      `/branch?sortBy=org_id&sortOrder=asc`
    );

    if (response.data.statusCode === 200) {
      return response.data.data;
    } else {
      showErrorToast(response.data.message);
      return [];
    }
  } catch (error: any) {
      showErrorToast(
        error.response?.data?.message || "Failed to fetch branch data"
      );
    throw error;
  }
  
};
