import axiosInstance from "../AxiosInstance";

interface User {
  id: number;
  email: string;
  username: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  employee_id: string | null;
  is_active: boolean;
  join_date: string | null;
  picture: string;
  updated_by: string;
  valid_from: string;
  valid_to: string | null;
  last_login: string | null;
  phone: string | null;
  user_uuid: string | null;
  branch_id: number | null;
  region_code: string | null;
  non_employee: boolean;
  role_name: string;
  role_description: string;
  organization_name: string | null;
  organization_code: string | null;
  employee_name: string | null;
  supervisor_number: string | null;
  salesrep_name: string | null;
  role: {
    id: number;
    name: string;
    description: string;
  };
  branch: any | null; // Update this type if you have a specific structure for branch
  employee: any | null; // Update this type if you have a specific structure for employee
}

interface UpdateUser {
  role_id: number;
  branch_id: number;
  region_code: string;
  supervisor_number: string;
  phone: string;
  is_active: boolean;
  is_sales:boolean;
  valid_from: string;
  valid_to: string;
  updated_by: string;
  name: string;
}

// GET all users
export const fetchAllUser = async () => {
  try {
    const res = await axiosInstance.get("/admin/user/all");
    console.log("Fetched users:", res.data.data);
    
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

  const res = await axiosInstance.post("/admin/user", payload);
  if (res.data.statusCode !== 200) {
    throw new Error(res.data.message || "Gagal tambah user");
  }
  return res.data;
};

export const fetchDetailUser = async (employee_id: any) => {
  try {
    const res = await axiosInstance.get(`/user/profile/${employee_id}`);

    console.log('Fetched user details:', res);
    
    return res.data.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch users:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

// PUT update user
export const updateUser = async (employeeId: string, payload: UpdateUser) => {

  try {
    const res = await axiosInstance.put(`/user/${employeeId}`, payload);    
    if (res.data.statusCode !== 200) {
      throw new Error(res.data.message || "Gagal update user");
    }
    return res.data;
  } catch (error: any) {
    console.error(
      "Failed to update user:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};
