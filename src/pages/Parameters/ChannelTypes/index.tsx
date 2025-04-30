import ViewTable from "./Table/ViewTable";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function MasterUser() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Channel Type" }]} />
      {/* <PageBreadcrumb
        breadcrumbs={[
          { title: "Parameters", path: "/master_parameters" },
          { title: "Channel Type" },
        ]}
      /> */}
      <ViewTable />
    </div>
  );
}
