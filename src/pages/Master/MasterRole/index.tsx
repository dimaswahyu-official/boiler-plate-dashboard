import TableMasterRole from "./Table/ViewMasterRole";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function MasterMenu() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Create Role" }]} />
      <TableMasterRole />
    </div>
  );
}
