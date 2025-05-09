
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/DataTable";


export default function MasterSalesman() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Salesman" }]} />
      <ViewTable />
    </div>
  );
}
