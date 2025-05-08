
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/DataTable";


export default function MasterRegion() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Region" }]} />
      <ViewTable />
    </div>
  );
}
