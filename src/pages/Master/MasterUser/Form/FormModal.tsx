import React from "react";
import ModalComponent from "../../../../components/modal/ModalComponent";
import FormCreateUser from "./FormCreateUser";
// import FormCreateUser from "./FormCreateUserLogic";

import FormDetailUser from "./FormDetailUser";

interface ReusableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formFields: Array<any>;
  title: string;
  defaultValues?: any;
  mode: "create" | "update"; // Tambahkan mode
}

const FormModal: React.FC<ReusableFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formFields,
  title,
  defaultValues,
  mode, // Terima mode
}) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="medium"
    >
      {mode === "create" ? (
        <FormCreateUser
          formFields={formFields}
          onSubmit={(data) => {
            onSubmit(data);
          }}
          onClose={onClose}
          defaultValues={defaultValues}
        />
      ) : (
        <FormDetailUser
          formFields={formFields}
          onClose={onClose}
          defaultValues={defaultValues} // Pass defaultValues
          optionRoles={
            formFields.find((field) => field.name === "roles")?.options || []
          }
          optionBranch={
            formFields.find((field) => field.name === "branch")?.options || []
          }
          optionRegion={
            formFields.find((field) => field.name === "region")?.options || []
          }
        />
      )}
    </ModalComponent>
  );
};

export default FormModal;
