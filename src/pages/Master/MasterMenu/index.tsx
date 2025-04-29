import TableMasterMenu from "./Table/ViewMasterMenu";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";


export default function MasterMenu() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master Menu" }]} />
      <TableMasterMenu />
    </div>
  );
}
