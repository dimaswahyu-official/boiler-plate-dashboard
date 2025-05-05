import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ViewTable from "../../Table/ViewTable";
import { useLocation } from "react-router-dom";


export default function PaymentTypes() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Payment types" }]} />
      <ViewTable currentPath={currentPath} />
    </div>
  );
}
