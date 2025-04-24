import TableMasterRole from './components/TableMasterRole';
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";

export default function MasterMenu() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Master Roles" />
            <TableMasterRole />
        </div>
    )
}


