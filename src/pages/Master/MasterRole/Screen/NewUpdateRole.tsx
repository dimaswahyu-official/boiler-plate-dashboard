import { use, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import UpdateForm from "./UpdateForm";
// import NewTableMenuPermission from "../Table/NewTableMenuPermission";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useRoleStore } from "../../../../API/store/roleStore";

export default function NewUpdateRole() {
  const location = useLocation();
  const { id } = location.state || {};
  const { fetchRoleById } = useRoleStore();
  const [role, setRole] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchRoleById(id)
        .then((fetchedRole) => setRole(fetchedRole))
        .catch((error) => console.error("Error fetching role:", error));
    }
  }, [id, fetchRoleById]);

//   useEffect(() => {
//     console.log("Fetched role:", role);
//   }, [role]);

  return (
    <>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Master Role", path: "/master_role" },
          { title: "Update Role" },
        ]}
      />
      <h1>{id}</h1>
      {role && <UpdateForm paramRole={role} />}
    </>
  );
}
