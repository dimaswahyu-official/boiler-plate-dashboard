import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UpdateForm from "./UpdateForm";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useRoleStore } from "../../../../API/store/MasterStore/masterRoleStore";

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

  return (
    <>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Master Role", path: "/master_role" },
          { title: "Update Role" },
        ]}
      />
      {role && <UpdateForm paramRole={role} />}
    </>
  );
}
