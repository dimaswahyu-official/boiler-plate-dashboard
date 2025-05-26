import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import AdjustTable from "./AdjustTable";
import axios from "axios";

const TableMasterMenu = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

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
    await deleteMenu(id);
    fetchMenus();
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://10.0.29.47:9003/api/v1/region/meta-sync`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiData = response.data.data.data;
      console.log("API Data:", apiData);

      setData(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
        data={data}
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
