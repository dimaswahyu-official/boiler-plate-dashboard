import ViewMasterUser from "./Table/ViewMasterUser";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function MasterUser() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Master User" }]} />
      <ViewMasterUser />
    </div>
  );
}
