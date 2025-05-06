import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ViewTable from "./Table/ViewTable";

export default function SuratTugas() {
  return (
    <div>
      <PageBreadcrumb breadcrumbs={[{ title: "Surat Tugas" }]} />
      <ViewTable />
    </div>
  );
}
