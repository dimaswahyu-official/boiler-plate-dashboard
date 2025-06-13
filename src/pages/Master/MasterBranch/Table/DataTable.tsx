import React, { useEffect, useState } from "react";
import Input from "../../../../components/form/input/InputField";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import { useBranchStore } from "../../../../API/store/MasterStore/masterBranchStore";
import AdjustTable from "./AdjustTable";

const TableMasterMenu = () => {
  const { fetchMenus, fetchParentMenus } = useMenuStore();
  const { fetchBranches, branches } = useBranchStore();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [editMenuData, setEditMenuData] = useState<any | null>(null);

  useEffect(() => {
    fetchParentMenus();
    fetchMenus();
    fetchBranches();
  }, []);

  const handleDetail = (id: number) => {
    alert("Detail action is not implemented yet.");
  };

  const handleDelete = async (id: number) => {
    alert("Delete action is not implemented yet.");
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
        </div>
      </div>

      <AdjustTable
        data={branches}
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
