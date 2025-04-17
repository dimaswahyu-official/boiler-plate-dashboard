import axiosInstance from './AxiosInstance';

interface LoginPayload {
  username: string;
  password: string;
  ip_address : string;
  device_info: string;
}

export const loginService = async (payload: LoginPayload) => {
  try {
    // const { data } = await axiosInstance.post('/auth/login', payload);
    const { data } = await axiosInstance.post('/login/', payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
