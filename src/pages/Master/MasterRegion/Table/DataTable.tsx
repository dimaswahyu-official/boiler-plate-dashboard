import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import { useRegionStore } from "../../../../API/store/MasterStore/masterRegionStore";

import AdjustTable from "./AdjustTable";
import axios from "axios";

const TableMasterMenu = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const { fetchMenus, menus, fetchParentMenus, deleteMenu } = useMenuStore();
  const { fetchRegion, regions } = useRegionStore();

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editMenuData, setEditMenuData] = useState<any | null>(null);

  useEffect(() => {
    fetchParentMenus();
    fetchMenus();
    fetchRegion();
  }, []);

  const handleDetail = (id: number) => {
    navigate("/detail_user", { state: { userId: id } });
  };

  const handleDelete = async (id: number) => {
    await deleteMenu(id);
    fetchMenus();
  };


  useEffect(() => {
    console.log("regions", regions);
  }, []);

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
        </div>
      </div>

      <AdjustTable
        data={regions}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
        onEdit={(data) => setEditMenuData(data)}
      />
    </>
  );
};

export default TableMasterMenu;
