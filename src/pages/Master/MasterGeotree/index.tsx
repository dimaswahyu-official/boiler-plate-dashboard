
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/ViewMasterGeotree";


export default function MasterGeotree() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Geotree" }]} />
      <ViewTable />
    </div>
  );
}
