
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/DataTable";


export default function MasterBranch() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Branch" }]} />
      <ViewTable />
    </div>
  );
}
