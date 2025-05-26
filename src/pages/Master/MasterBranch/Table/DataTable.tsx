import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../../../components/form/input/InputField";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import AdjustTable from "./AdjustTable";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../../../../components/toast";

const TableMasterMenu = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const { fetchMenus, fetchParentMenus, deleteMenu } = useMenuStore();
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
    // // await deleteMenu(id);
    
    // const res = await deleteMenu(id);
    // if (!res.ok) {
    //   showErrorToast(res.message);
    //   return;
    // }
    // fetchMenus();
    // showSuccessToast("Menu berhasil dihapus");
  };

  const fetchDataBranch = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://10.0.29.47/api/v1/branch?sortBy=org_id&sortOrder=asc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const apiData = response.data.data;
      console.log("API Data:", apiData);

      setData(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataBranch();
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
