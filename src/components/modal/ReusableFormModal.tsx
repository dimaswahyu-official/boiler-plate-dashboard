import React from "react";
import ModalComponent from "../../components/modal/ModalComponent";
import UserForm from "../form-input/userForm";

interface ReusableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formFields: Array<any>;
  title: string;
  defaultValues?: any;
}

const ReusableFormModal: React.FC<ReusableFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formFields,
  title,
  defaultValues,
}) => {
  return (
    <>
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size="large"
      >
        <UserForm
          formFields={formFields}
          onSubmit={(data) => {
            onSubmit(data);
          }}
          onClose={onClose}
          defaultValues={defaultValues}
        />
      </ModalComponent>
    </>
  );
};

export default ReusableFormModal;
