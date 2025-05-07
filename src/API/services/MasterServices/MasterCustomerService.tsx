import axiosInstance from "../AxiosInstance";
import { showSuccessToast, showErrorToast } from "../../../components/toast";

interface Address {
  id: number;
  customer_id: number;
  address1: string;
  provinsi: string;
  kab_kodya: string;
  kecamatan: string;
  kelurahan: string | null;
  kodepos: string | null;
  latitude: string;
  longitude: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

interface Customer {
  id: number;
  name: string;
  alias: string | null;
  owner: string | null;
  phone: string | null;
  npwp: string | null;
  ktp: string | null;
  channel: string;
  customer_number: string;
  cust_account_id: number;
  bill_to_location: string;
  ship_to_location: string;
  order_type_name: string | null;
  order_type_id: string | null;
  return_order_type_name: string | null;
  return_order_type_id: string | null;
  site_type: string;
  bill_to_site_use_id: number;
  ship_to_site_use_id: number;
  site_use_id: string;
  credit_checking: string | null;
  credit_exposure: string;
  overall_credit_limit: string;
  trx_credit_limit: string;
  term_name: string;
  term_id: number;
  term_day: number;
  price_list_name: string;
  price_list_id: number;
  organization_code: string;
  organization_name: string;
  organization_id: number;
  org_name: string;
  org_id: string;
  is_active: boolean;
  is_stockist: boolean;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  deleted_at: string | null;
  addresses: Address[];
}

interface FetchCustomersResponse {
  statusCode: number;
  message: string;
  data: {
    data: Customer[];
    count: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    message: string;
    status: boolean;
  };
}

export const fetchCustomers = async (
  page?: number,
  limit?: number,
  sortBy?: string,
  sortOrder?: string,
  search?: string
): Promise<{ customers: Customer[]; totalCount: number }> => {
  try {
    const queryParams = new URLSearchParams();

    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);
    if (search) queryParams.append("search", search);

    const response = await axiosInstance.get<FetchCustomersResponse>(
      `/customer?${queryParams.toString()}`
    );

    if (response.data.data.status) {
      return {
        customers: response.data.data.data,
        totalCount: response.data.data.count,
      };
    } else {
      showErrorToast(response.data.data.message);
      return { customers: [], totalCount: 0 };
    }
  } catch (error: any) {
    showErrorToast(
      error.response?.data?.message || "Failed to fetch customers"
    );
    throw error;
  }
};
