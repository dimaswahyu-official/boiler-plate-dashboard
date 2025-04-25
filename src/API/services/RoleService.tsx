import axiosInstance from "./AxiosInstance";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: {
    menu_id: number;
    permission_type: string;
  }[];
}

interface CreateRolePayload {
  name: string;
  description: string;
  permissions: {
    menu_id: number;
    permission_type: string;
  }[];
}

export const fetchAllRole = async (): Promise<Role[]> => {
  try {
    const res = await axiosInstance.get("/roles");

    // Extract and map the data to match the Role interface
    const roles: Role[] = res.data.data.map((role: any) => ({
      id: role.id,
      name: role.name,
      description: role.description,
    }));

    return roles;
  } catch (error: any) {
    console.log("Failed to fetch role.");
    console.error(
      "Failed to fetch role:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch role");
  }
};

export const createRole = async (payload: CreateRolePayload): Promise<void> => {
  try {
    const res = await axiosInstance.post("/roles", payload);
    console.log("Role created successfully!", res.data);
  } catch (error: any) {
    console.error(
      "Failed to create role:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create role");
  }
};

export const fetchRoleById = async (id: number): Promise<Role> => {
  try {
    const res = await axiosInstance.get(`/roles/${id}`);

    // Mapping data dari API ke interface Role
    const role: Role = {
      id: res.data.data.id,
      name: res.data.data.name,
      description: res.data.data.description,
      permissions: Array.isArray(res.data.data.permissions)
        ? res.data.data.permissions.map((permission: any) => ({
            menu_id: permission.menu_id,
            permission_type: permission.permission_type,
          }))
        : [],
    };

    return role;
  } catch (error: any) {
    console.error(
      "Failed to fetch role by ID:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch role by ID"
    );
  }
};

export const updateRole = async (id: number, payload: CreateRolePayload): Promise<void> => {
  try {
    const res = await axiosInstance.put(`/roles/${id}`, payload);
    console.log("Role Update successfully!", res.data);
  } catch (error: any) {
    console.error(
      "Failed to update role:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to upadate role");
  }
};
