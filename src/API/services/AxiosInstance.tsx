import axios from "axios";
import EnPoint from "../../utils/EndPoint";

const baseURL = EnPoint;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.clear();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
