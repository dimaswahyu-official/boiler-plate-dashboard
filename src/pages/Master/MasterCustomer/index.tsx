
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/ViewMasterCustomer";

export default function MasterCustomer() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Customer" }]} />
      <ViewTable />
    </div>
  );
}
