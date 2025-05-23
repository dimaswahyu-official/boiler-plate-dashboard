import React, { useEffect } from "react";
import {
  useWatch,
  UseFormRegister,
  Control,
  useFormContext,
} from "react-hook-form";
import PasswordFieldView from "./PasswordFieldView";
import { FormField } from "../FormCreateUserView";

interface PasswordFieldContainerProps {
  field: FormField;
  control: Control<any>;
  register: UseFormRegister<any>;
  error: string | undefined;
  toggle: (name: string) => void;
  show: boolean;
  isSubmitted?: boolean;
}

const PasswordFieldContainer: React.FC<PasswordFieldContainerProps> = ({
  field,
  control,
  register,
  error,
  toggle,
  show,
  isSubmitted,
}) => {
  const { trigger } = useFormContext();
  const value = useWatch({ control, name: field.name });
  const password = useWatch({ control, name: "password" });
  const isConfirm = field.name === "confirm_password";
  const matched = isConfirm && value && value === password;

  useEffect(() => {
    if (!isConfirm) {
      trigger("confirm_password");
    }
  }, [password, trigger, isConfirm]);

  /* Tentukan pesan & warna */
  const feedback = (() => {
    const minLengthValid = value?.length >= 12;
    const patternValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value || "");
  
    if (matched) return { text: "Password cocok", cls: "text-green-600" };
    if (error) return { text: error, cls: "text-red-500" };
    if (isConfirm && value && !matched)
      return { text: "Password belum sama", cls: "text-red-500" };
    if (!isConfirm && value && minLengthValid && patternValid)
      return {
        text: "Great! Your password meets all the requirements.",
        cls: "text-green-600",
      };
    return { text: "", cls: "text-transparent" };
  })();

  return (
    <PasswordFieldView
      field={field}
      register={register}
      error={error}
      toggle={toggle}
      show={show}
      feedback={feedback}
      matched={matched}
      password={password}
      isSubmitted={isSubmitted ?? false}
    />
  );
};

export default PasswordFieldContainer;
