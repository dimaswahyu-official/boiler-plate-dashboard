import axiosInstance from "../AxiosInstance";
import { showErrorToast } from "../../../components/toast";

interface LoginPayload {
  email: string;
  password: string;
  ip_address: string;
  device_info: string;
}

export const loginService = async (payload: LoginPayload) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", payload);

    if (data.statusCode === 200) {
      return data;
    }
  } catch (error: any) {
    showErrorToast(`Error response: ${error.response?.data?.message || "Unknown error"}`);
    console.error("Error response:", error.response?.data);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
