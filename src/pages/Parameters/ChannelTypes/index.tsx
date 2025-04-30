import ViewTable from "./Table/ViewTable";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function ChannelType() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Channel Type" }]} />
      <ViewTable />
    </div>
  );
}
