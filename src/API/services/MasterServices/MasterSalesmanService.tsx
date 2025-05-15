import axiosInstance from "../AxiosInstance";
import { showErrorToast } from "../../../components/toast";

interface Salesman {
  salesrep_number: string;
  salesrep_name: string | null;
  employee_name: string;
  supervisor_number: string | null;
  salesrep_id: number;
  sales_credit_type_id: number;
  subinventory_code: string;
  locator_id: number;
  vendor_name: string;
  vendor_num: string;
  vendor_site_code: string;
  vendor_id: number;
  vendor_site_id: number;
  organization_code: string;
  organization_name: string;
  organization_id: number;
  org_name: string;
  org_id: string;
  status: string;
  start_date_active: string;
  end_date_active: string | null;
}

interface FetchSalesmanResponse {
  statusCode: number;
  message: string;
  data: {
    data: Salesman[];
  };
}

export const fetchSalesman = async (): Promise<Salesman[]> => {
  try {
    const response = await axiosInstance.get<FetchSalesmanResponse>(
      `/salesman/meta-find-all`
    );

    if (response.data.statusCode === 200) {
      return response.data.data.data;
    } else {
      showErrorToast(response.data.message);
      return [];
    }
  } catch (error: any) {
    showErrorToast(
      error.response?.data?.message || "Failed to fetch salesmen data"
    );
    throw error;
  }
};
