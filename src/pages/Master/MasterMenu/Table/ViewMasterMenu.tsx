import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import AdjustTableMenu from "./AdjustTableMenu";
import MenuFormSection from "./FormCreateMenu";
import UpdateModal from "./FormUpdateMenu";
import { showSuccessToast } from "../../../../components/toast";

const TableMasterMenu = () => {
  const navigate = useNavigate();
  const { fetchMenus, menus, fetchParentMenus, deleteMenu } = useMenuStore();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editMenuData, setEditMenuData] = useState<any | null>(null);

  useEffect(() => {
    fetchParentMenus();
    fetchMenus();
  }, []);

  const handleDetail = (id: number) => {
    navigate("/detail_user", { state: { userId: id } });
  };

  const handleDelete = async (id: number) => {
    const res = await deleteMenu(id);
    if (!res.ok) {
      console.log("Failed to delete menu:", res.message);
      return;
    }
    fetchMenus();
    showSuccessToast("Menu berhasil dihapus");
  };

  const tableData = useMemo(() => {
    const flattenMenus = (
      menus: any[],
      parentId: number | null = null
    ): any[] =>
      menus.reduce((acc, menu) => {
        const { children, ...rest } = menu;
        acc.push({ ...rest, parent_id: parentId });
        if (children?.length) acc.push(...flattenMenus(children, menu.id));
        return acc;
      }, []);
    return flattenMenus(menus);
  }, [menus]);

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <Input
            onChange={(e) => setGlobalFilter(e.target.value)} // Pastikan ini menerima string secara langsung
            type="text"
            id="search"
            placeholder="🔍 Search..."
          />

          <MenuFormSection onRefresh={fetchMenus} />
        </div>
      </div>

      <AdjustTableMenu
        data={tableData}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
        onEdit={(data) => setEditMenuData(data)}
      />

      {editMenuData && (
        <UpdateModal
          isOpen={!!editMenuData}
          onClose={() => setEditMenuData(null)}
          existingData={editMenuData}
          onRefresh={fetchMenus}
        />
      )}
    </>
  );
};

export default TableMasterMenu;
