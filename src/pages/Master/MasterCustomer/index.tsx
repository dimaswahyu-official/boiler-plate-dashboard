import ViewMasterCustomer from "./Table/ViewMasterCustomer";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function MasterUser() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master User" }]} />
      <ViewMasterCustomer />
    </div>
  );
}
