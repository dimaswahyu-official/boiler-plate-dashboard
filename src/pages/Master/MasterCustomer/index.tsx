
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/ViewMasterCustomer";
// import ViewTable from "./Table/DataTable";


export default function MasterCustomer() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Customer" }]} />
      <ViewTable />
    </div>
  );
}
