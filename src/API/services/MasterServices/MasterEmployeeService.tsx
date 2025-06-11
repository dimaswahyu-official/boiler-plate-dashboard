import { showErrorToast } from "../../../components/toast";
import axiosInstance from "../AxiosInstance";

interface Employee {
  employee_id: string;
  employee_name: string;
}

interface FetchResponse {
  statusCode: number;
  message: string;
  data: [];
}

interface EmployeeData {
  salesrep_id: string | null;
  sales_credit_type_id: string | null;
  subinventory_code: string | null;
  locator_id: string | null;
  employee_number: string;
  employee_name: string;
  flag_salesman: string;
  supervisor_number: string | null;
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
  effective_start_date: string;
  effective_end_date: string;
}

export const fetchAllEmployees = async (): Promise<EmployeeData[]> => {
  try {
    const response = await axiosInstance.get("employee/meta-find-all");


    if (response.data.statusCode === 200) {
      return response.data.data.data;
    } else {
      showErrorToast(response.data.message);
      return [];
    }
  } catch (error: any) {
    showErrorToast(error.response?.data?.message || "Error fetching employees");
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const checkEmployee = async (nik: string): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.get(
      `employee/meta-find-employee-number/${nik}`
    );

    console.log("Response from checkEmployee:", response.data);

    if (response.data.statusCode === 200) {
      const responseData = response.data.data;
      return responseData.data.data;
    } else {
      showErrorToast(response.data.message);
      return [];
    }
  } catch (error: any) {
    showErrorToast(error.response?.data?.message || "Error checking employee");
    console.error("Error checking employee:", error);
    throw error;
  }
};
