
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/DataTable";


export default function MasterEmployee() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Employee" }]} />
      <ViewTable />
    </div>
  );
}
