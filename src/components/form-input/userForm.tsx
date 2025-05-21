import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../../components/form/date-picker";
import Button from "../ui/button/Button";
import Checkbox from "../form/input/Checkbox";
import { showErrorToast } from "../toast";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "file"
  | "date"
  | "checkbox"
  | "password";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  /** Only for select */
  options?: { value: string | boolean; label: string }[];
  /** react-hook-form validation rules */
  validation?: {
    required?: boolean | string;
    [key: string]: unknown;
  };
  /** Additional note under the input */
  info?: string;
}

export type FormValues = Record<string, unknown>;

export interface UserFormInputProps {
  formFields: FormField[];
  onSubmit: SubmitHandler<FormValues>;
  onClose: () => void;
  defaultValues?: FormValues;
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

/** Password field with show/hide + live match indicator for confirm_password */
const PasswordField: React.FC<{
  field: FormField;
  control: any;
  register: ReturnType<typeof useForm>["register"];
  error: string | undefined;
  toggle: (name: string) => void;
  show: boolean;
}> = ({ field, control, register, error, toggle, show }) => {
  const value = useWatch({ control, name: field.name });
  const password = useWatch({ control, name: "password" });
  const isConfirm = field.name === "confirm_password";
  const matched = isConfirm && value && value === password;

  return (
    <div className="relative">
      {/* input & eye icon */}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          autoComplete="new-password"
          {...register(field.name, {
            ...field.validation,
            validate: isConfirm
              ? (v: string) => v === password || "Password tidak sama"
              : undefined,
          })}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring ${
            matched
              ? "border-green-500 focus:ring-green-300"
              : error
              ? "border-red-500 focus:ring-red-300"
              : "focus:ring-blue-300"
          }`}
        />
        <button
          type="button"
          onClick={() => toggle(field.name)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          tabIndex={-1}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {/* feedback */}
      {matched && (
        <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
          <FaCheck className="h-3 w-3" />
          Password cocok
        </p>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {!matched && !error && isConfirm && value && (
        <p className="text-red-500 text-sm mt-1">Password belum sama</p>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                Main Component                              */
/* -------------------------------------------------------------------------- */

const UserFormInput: React.FC<UserFormInputProps> = ({
  formFields,
  onSubmit,
  onClose,
  defaultValues,
}) => {
  /* ------------------------------ react-hook-form ----------------------------- */
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ defaultValues, mode: "onChange" });

  /* ------------------------------ local states -------------------------------- */
  const [nikStatus, setNikStatus] = useState<
    "valid" | "invalid" | "checking" | null
  >(null);
  const [showPwdMap, setShowPwdMap] = useState<Record<string, boolean>>({});

  /* ------------------------------ side effects -------------------------------- */
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  /* -------------------------------- handlers ---------------------------------- */
  const toggleShowPassword = useCallback(
    (name: string) =>
      setShowPwdMap((prev) => ({ ...prev, [name]: !prev[name] })),
    []
  );

  const checkNik = useCallback(async (nik: string) => {
    if (!nik) return;
    setNikStatus("checking");
    try {
      const res = await fetch(`/api/check-nik?nik=${nik}`);
      const data = await res.json();
      setNikStatus(data.exists ? "valid" : "invalid");
    } catch (e) {
      console.error(e);
      setNikStatus("invalid");
    }
  }, []);

  const onSubmitInternal: SubmitHandler<FormValues> = (data) => {
    if (nikStatus === "invalid") {
      showErrorToast("NIK tidak ditemukan. Tidak dapat mengirimkan formulir.");
      return;
    }
    onSubmit(data);
  };

  /* ------------------------------ render helpers ------------------------------ */
const renderField = (field: FormField) => {
    const commonClasses =
        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300";

    const errorClasses =
        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-red-300";

    const getClassName = (hasError: boolean) =>
        hasError ? errorClasses : commonClasses;

    switch (field.type) {
        case "textarea":
            return (
                <textarea
                    {...register(field.name, field.validation)}
                    className={getClassName(!!errors[field.name])}
                />
            );

        case "select":
            return (
                <Controller
                    name={field.name}
                    control={control}
                    rules={{
                        validate: (v) =>
                            (v !== undefined && v !== null) || field.validation?.required,
                    }}
                    render={({ field: c }) => (
                        <Select
                            {...c}
                            options={field.options}
                            placeholder="Select an option"
                            classNamePrefix="react-select"
                            value={field.options?.find((o) => o.value === c.value)}
                            onChange={(opt) => c.onChange(opt?.value ?? null)}
                        />
                    )}
                />
            );

        case "file":
            return (
                <input
                    type="file"
                    {...register(field.name, field.validation)}
                    className={getClassName(!!errors[field.name])}
                />
            );

        case "date":
            return (
                <Controller
                    name={field.name}
                    control={control}
                    rules={field.validation}
                    render={({ field: c }) => (
                        <DatePicker
                            id={`${field.name}-date-picker`}
                            placeholder="Select a date"
                            onChange={(d: Date | Date[]) =>
                                c.onChange(Array.isArray(d) ? d[0] : d)
                            }
                        />
                    )}
                />
            );

        case "checkbox":
            return (
                <div className="flex items-center gap-2">
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: c }) => (
                            <Checkbox checked={!!c.value} onChange={c.onChange} label="" />
                        )}
                    />
                    {field.info && (
                        <p className="text-sm text-blue-400 italic">{field.info}</p>
                    )}
                </div>
            );

        case "text":
            if (field.name === "nik") {
                return (
                    <div>
                        <input
                            type="text"
                            {...register(field.name, field.validation)}
                            className={getClassName(!!errors[field.name])}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length === 5) checkNik(val);
                                else setNikStatus(null);
                            }}
                        />
                        {nikStatus === "checking" && (
                            <p className="text-blue-500 text-sm">Checking...</p>
                        )}
                        {nikStatus === "valid" && (
                            <p className="text-green-600 text-sm">NIK valid</p>
                        )}
                        {nikStatus === "invalid" && (
                            <p className="text-red-500 text-sm">NIK tidak ditemukan</p>
                        )}
                    </div>
                );
            }
            return (
                <input
                    type="text"
                    {...register(field.name, field.validation)}
                    className={getClassName(!!errors[field.name])}
                />
            );

        case "password":
            return (
                <PasswordField
                    field={field}
                    control={control}
                    register={register}
                    error={errors[field.name]?.message as string | undefined}
                    show={!!showPwdMap[field.name]}
                    toggle={toggleShowPassword}
                />
            );

        default:
            return (
                <input
                    type="text"
                    {...register(field.name, field.validation)}
                    className={getClassName(!!errors[field.name])}
                />
            );
    }
};

  /* ------------------------------ layout helpers ------------------------------ */
  const [leftFields, rightFields] = useMemo(() => {
    if (formFields.length <= 6) return [formFields, []];
    const mid = Math.ceil(formFields.length / 2);
    return [formFields.slice(0, mid), formFields.slice(mid)];
  }, [formFields]);

  /* ---------------------------------- view ----------------------------------- */
  return (
    <div className="mx-auto mt-10 p-6 rounded-md">
      <form onSubmit={handleSubmit(onSubmitInternal)} className="space-y-4">
        <div
          className={`grid ${
            rightFields.length ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          } gap-6`}
        >
          {[leftFields, rightFields].map(
            (col, idx) =>
              col.length > 0 && (
                <div key={idx}>
                  {col.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        {field.label}
                      </label>
                      {renderField(field)}
                      {/* Error fallback for non-password field */}
                      {field.type !== "password" && errors[field.name] && (
                        <p className="text-red-500 text-sm mt-1">
                          {(errors[field.name] as any).message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )
          )}
        </div>

        <div className="flex justify-end gap-2 mt-10">
          {/* <Button variant="outline" onClick={onClose}>
            Cancel
          </Button> */}
          <Button variant="primary">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default UserFormInput;
