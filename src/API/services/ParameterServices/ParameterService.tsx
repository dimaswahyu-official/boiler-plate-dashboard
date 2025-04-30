import axiosInstance from "../AxiosInstance";
import { showSuccessToast, showErrorToast } from "../../../components/toast";

interface Parameters {
  key: string;
  value: string;
  label: string;
  is_active: boolean;
  created_by: string;
}

export const fetchParameter = async (key: string) => {
  try {
    const res = await axiosInstance.get(`/parameter?key=${key}`);
    if (res.data.statusCode === 200) {
      return res.data.data;
    } else {
      throw new Error("Unexpected response status code");
    }
  } catch (error: any) {
    console.error(
      "Failed to fetch parameter by key:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch parameter by key"
    );
  }
};

export const createParameter = async (payload: Parameters) => {
  try {
    const res = await axiosInstance.post("/parameter", payload);
    console.log("Response from createParameter:", res.data);

    if (res.data.statusCode === 200) {
      showSuccessToast("Berhasil tambah channel type!");
      return res.data;
    }
  } catch (error: any) {
    showErrorToast(`${error.response?.data?.message}`);
    console.error(
      "Failed to create channel type:",
      error.response?.data || error.message,
      "Full error response:",
      error.response
    );
    throw new Error(
      error.response?.data?.message || "Failed to create channel type"
    );
  }
};
