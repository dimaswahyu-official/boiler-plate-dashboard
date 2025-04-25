import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import { useRoleStore } from "../../../../API/store/roleStore";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import AdjustTableRole from "./AdjustTableRole";

const TableMasterRole = () => {
  const navigate = useNavigate();
  const { fetchRoles, roles } = useRoleStore();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDetail = (id: number) => {
    console.log(`Detail role with ID: ${id}`);
  };

  const handleDelete = async (id: number) => {
    console.log(`Detail role with ID: ${id}`);
  };

  return (
    <>
      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <Input
            onChange={(e) => setGlobalFilter(e.target.value)}
            type="text"
            id="search"
            placeholder="🔍 Search..."
          />

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/create_role")}
          >
            <FaPlus className="mr-2" /> Tambah Role
          </Button>
        </div>
      </div>

      <AdjustTableRole
        data={roles}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onDetail={handleDetail}
        onDelete={handleDelete}
      />
    </>
  );
};

export default TableMasterRole;
