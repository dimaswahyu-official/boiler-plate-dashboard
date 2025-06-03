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

export const checkEmployee = async (nik: string): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.get(
      `employee/meta-find-employee-number/${nik}`
    );
    console.log("Response from checkEmployee Store:", response.data);

    if (response.data.statusCode === 200) {
      const responseData = response.data.data;
      if (responseData.data.length === 0) {
       showErrorToast(response.data.data.message);
        return [];
      }
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
