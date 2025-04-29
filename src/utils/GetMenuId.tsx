export const getMenuIdByPath = (path: string): number | null => {
  const userLoginData = localStorage.getItem("user_login_data");
  if (!userLoginData) return null;

  try {
    const { menus } = JSON.parse(userLoginData);
    const menu = menus.find((menu: any) => menu.path === path);
    return menu ? menu.id : null;
  } catch (error) {
    console.error("Failed to parse user_login_data:", error);
    return null;
  }
};
