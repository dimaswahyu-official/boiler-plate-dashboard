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
      // Clear token, refresh the page, and redirect to login if unauthorized
      localStorage.clear();
      window.location.reload();
      setTimeout(() => {
        window.location.href = "/signin";
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
