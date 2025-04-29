import axiosInstance from "./AxiosInstance";

interface User {
  name: string;
  email: string;
  username: string;
  employee_id: string;
  password: string;
  picture: string;
  is_active: boolean;
  join_date: string;
  valid_from: string;
  valid_to: string;
  role_id: number;
  created_by: string;
  updated_by: string;
}

export const fetchAllUser = async () => {
  try {
    const res = await axiosInstance.get("/admin/user/all");
    console.log("Fetched users from service:", res.data.data);
    return res.data.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch users:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

// POST a new user
export const createUser = async (payload: User) => {
  console.log("Creating user with payload:", payload);
  
  try {
    const res = await axiosInstance.post("/admin/user", payload);
    console.log("User created successfully:", res.data);
    return res.data;
  } catch (error: any) {
    console.error(
      "Failed to create user:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};
