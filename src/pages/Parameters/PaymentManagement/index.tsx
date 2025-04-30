import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/ViewTable";

export default function PaymentManagement() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Payment Management" }]} />
      <ViewTable />
    </div>
  );
}
