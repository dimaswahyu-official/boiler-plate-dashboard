import React from "react";
import ModalComponent from "../../../../components/modal/ModalComponent";
import FormCreateUser from "../Form/FormCreateUser";

interface ReusableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formFields: Array<any>;
  title: string;
  defaultValues?: any;
}

const FormModal: React.FC<ReusableFormModalProps> = ({
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
        size="medium"
      >
        <FormCreateUser
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

export default FormModal;
