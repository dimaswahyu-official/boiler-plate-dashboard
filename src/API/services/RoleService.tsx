import axiosInstance from "./AxiosInstance";

interface Role {
  id: number;
  name: string;
  description: string;
}

export const fetchAllRole = async (): Promise<Role[]> => {
  try {
    const res = await axiosInstance.get("/roles");
    console.log("Role fetched successfully!");

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
