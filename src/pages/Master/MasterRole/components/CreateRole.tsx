import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";

function CreateRole() {
  return (
    <>
      <PageBreadcrumb
        pageTitle="Create Role"
        parentTitle="Master Roles"
        parentPath="/master_roles" // Path ke halaman induk
      />
      <div>CreateRole</div>
    </>
  );
}

export default CreateRole;