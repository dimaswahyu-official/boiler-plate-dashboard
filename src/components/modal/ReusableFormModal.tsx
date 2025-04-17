import React from "react";
import ModalComponent from '../../components/modal/ModalComponent';
import FormInput from "../../components/form-input";
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
}) => {
    return (
        <>
            <ModalComponent isOpen={isOpen} onClose={onClose} title={title}>
                <FormInput
                    formFields={formFields}
                    onSubmit={(data) => {
                        onSubmit(data);
                        onClose();
                    }}
                    onClose={onClose}
                />
            </ModalComponent>

            <Button variant="primary" size="sm" onClick={triggerButtonAction}>
                {triggerButtonIcon} {triggerButtonLabel}
            </Button>
        </>
    );
};

export default ReusableFormModal;