import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../../../components/form/input/InputField";
import { useRoleStore } from "../../../../API/store/roleStore";
import AdjustTableRole from "./AdjustTableRole";
import MenuFormSection from "./MenuFormSection";
import EditMenuModal from "./UpdateRole"; // baru

const TableMasterRole = () => { 
  const navigate = useNavigate();
  const { fetchRoles, roles } = useRoleStore();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editMenuData, setEditMenuData] = useState<any | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDetail = (id: number) => {
    navigate("/detail_user", { state: { userId: id } });
  };

  const handleDelete = async (id: number) => {
    // await deleteMenu(id);
    fetchRoles();
  };

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

          <MenuFormSection onRefresh={fetchRoles} />
        </div>
      </div>

      <AdjustTableRole
        data={roles}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
        onEdit={(data) => setEditMenuData(data)}
      />

      {editMenuData && (
        <EditMenuModal
          isOpen={!!editMenuData}
          onClose={() => setEditMenuData(null)}
          existingData={editMenuData}
          onRefresh={fetchRoles}
        />
      )}
    </>
  );
};

export default TableMasterRole;
