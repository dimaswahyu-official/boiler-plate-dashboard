import React, { useState, useMemo } from "react";
import ReusableFormModal from "../../../../components/modal/ReusableFormModal";
import { useMenuStore } from "../../../../API/store/MasterStore/masterMenuStore";
import {
  FaRegFileAlt,
  FaDollarSign,
  FaRegNewspaper,
  FaClipboardList,
  FaRoute,
  FaUserTag,
  FaChartLine,
  FaCreditCard,
  FaPlus,
  FaFlag,
} from "react-icons/fa";
import Button from "../../../../components/ui/button/Button";
import { usePagePermissions } from "../../../../utils/UserPagePermissions";

const MenuFormSection = ({ onRefresh }: { onRefresh: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { parentMenus, createMenu } = useMenuStore();
  const { canCreate, canManage } = usePagePermissions();

  const parentMenuOpt = useMemo(
    () => parentMenus.map((menu) => ({ value: menu.id, label: menu.name })),
    [parentMenus]
  );

  const iconOptions = [
    { value: "FaRegFileAlt", label: "Master Data", icon: <FaRegFileAlt /> },
    { value: "FaDollarSign", label: "Bank Account", icon: <FaDollarSign /> },
    { value: "FaClipboardList", label: "Report", icon: <FaClipboardList /> },
    { value: "FaRoute", label: "Route", icon: <FaRoute /> },
    { value: "FaUserTag", label: "Sales & Distribution", icon: <FaUserTag /> },
    { value: "FaChartLine", label: "Target Sales", icon: <FaChartLine /> },
    { value: "FaRegNewspaper", label: "News", icon: <FaRegNewspaper /> },
    { value: "FaCreditCard", label: "Credit Limit", icon: <FaCreditCard /> },
    { value: "FaFlag", label: "Flag", icon: <FaFlag /> },
  ];

  const formFields = [
    {
      name: "name",
      label: "Menu Name",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "path",
      label: "Path",
      type: "text",
      validation: { required: "Required" },
    },
    {
      name: "icon",
      label: "Icon",
      type: "select",
      options: iconOptions.map((option) => ({
        value: option.value,
        label: (
          <div key={option.value} className="flex items-center space-x-1">
            {option.icon}
            <span>{option.label}</span>
          </div>
        ),
      })),
      styles: {
        menu: (provided: any) => ({
          ...provided,
          maxHeight: "100px",
          overflowY: "auto",
        }),
      },
    },
    {
      name: "parent_id",
      label: "Parent",
      type: "select",
      options: [{ value: 0, label: "Tidak Ada" }, ...parentMenuOpt],
      validation: { required: "Required" },
    },
    {
      name: "order",
      label: "Order",
      type: "text",
      validation: { required: "Required" },
    },
  ];

  const handleSubmit = async (data: any) => {
    const payload = {
      ...data,
      parent_id: data.parent_id?.value
        ? Number(data.parent_id.value)
        : Number(data.parent_id),
      order: Number(data.order),
      icon: data.icon?.value || data.icon,
    };

    await createMenu(payload);
    onRefresh();
    setIsModalOpen(false);
  };

  return (
    <>
      {canManage && canCreate && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Tambah Menu
        </Button>
      )}

      <ReusableFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formFields={formFields}
        title="Create Menu"
      />
    </>
  );
};

export default MenuFormSection;
