import TableMasterUser from './TableMasterUser';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function MasterUser() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Master User" />
            <TableMasterUser />
        </div>
    )
}
