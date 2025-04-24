import React from "react";
import ModalComponent from "../../components/modal/ModalComponent";
import CreateForm from "../form-input/createForm";
import Button from "../../components/ui/button/Button";

interface ReusableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formFields: Array<any>;
  title: string;
  triggerButtonLabel: string;
  triggerButtonIcon?: React.ReactNode;
  triggerButtonAction?: () => void;
  defaultValues?: any;
}

const ReusableFormModal: React.FC<ReusableFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formFields,
  title,
  triggerButtonLabel,
  triggerButtonIcon,
  triggerButtonAction,
  defaultValues,
}) => {
  return (
    <>
      <ModalComponent isOpen={isOpen} onClose={onClose} title={title}>
        <CreateForm
          formFields={formFields}
          onSubmit={(data) => {
            onSubmit(data);
            onClose();
          }}
          onClose={onClose}
          defaultValues={defaultValues}
        />
      </ModalComponent>

      <Button variant="primary" size="sm" onClick={triggerButtonAction}>
        {triggerButtonIcon} {triggerButtonLabel}
      </Button>
    </>
  );
};

export default ReusableFormModal;
