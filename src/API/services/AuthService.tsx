import axiosInstance from "./AxiosInstance";

interface LoginPayload {
  email: string;
  password: string;
  ip_address: string;
  device_info: string;
}

export const loginService = async (payload: LoginPayload) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data;
  } catch (error: any) {
    console.error("Error response:", error.response?.data);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
