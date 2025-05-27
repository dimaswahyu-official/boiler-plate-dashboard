import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useDebounce } from "../../../../helper/useDebounce";
import FormCreateUserView from "./FormCreateUserView";
import { showErrorToast } from "../../../../components/toast";

export interface FormField {
  name: string;
  label: string;
  type: string;
  options?: { value: string | boolean; label: string }[];
  validation?: {
    required?: boolean | string;
    [key: string]: unknown;
  };
  info?: string;
  placeholder?: string;
}

export type FormValues = Record<string, unknown>;

export interface UserFormInputProps {
  formFields: FormField[];
  onSubmit: SubmitHandler<FormValues>;
  onClose: () => void;
  defaultValues?: FormValues;
}

const FormCreateUserLogic: React.FC<UserFormInputProps> = ({
  formFields,
  onSubmit,
  defaultValues,
  onClose,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<FormValues>({ defaultValues, mode: "onChange" });

  const rolesValue = useWatch({ control, name: "roles" }) as {
    label: string;
    value: string;
  };

  const isTSF = rolesValue?.label === "TSF";
  const isSales = rolesValue?.label === "SALESMAN";
  const isRegional = rolesValue?.label === "REGIONAL";

  const [nikStatus, setNikStatus] = useState<
    "valid" | "invalid" | "checking" | null
  >(null);
  const [showPwdMap, setShowPwdMap] = useState<Record<string, boolean>>({});
  const [nikData, setNikData] = useState<any>(null);
  const [nik, setNik] = useState("");
  const debouncedNik = useDebounce(nik, 500);

  const toggleShowPassword = useCallback(
    (name: string) =>
      setShowPwdMap((prev) => ({ ...prev, [name]: !prev[name] })),
    []
  );

  const checkNik = useCallback(
    async (nik: string) => {
      if (!nik) return;
      setNikStatus("checking");

      const url = isSales
        ? `http://10.0.29.47:9003/api/v1/salesman/meta-find-salesrep-number/${nik}`
        : `http://10.0.29.47:9003/api/v1/employee/meta-find-employee-number/${nik}`;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setNikStatus("invalid");
          setNikData(null);
          setError("nik", { type: "manual", message: "Token tidak ditemukan" });
          return;
        }
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const isValid = data?.data?.data?.length > 0;
        setNikStatus(isValid ? "valid" : "invalid");

        if (isValid) {
          const processedData = {
            ...data?.data?.data[0],
            employee_id: Number(data?.data?.data[0]?.employee_id) || null,
            salesrep_id: Number(data?.data?.data[0]?.salesrep_id) || null,
            organization_id:
              Number(data?.data?.data[0]?.organization_id) || null,
          };
          setNikData(processedData);
          clearErrors("nik");
        } else {
          setNikData(null);
          setError("nik", { type: "manual", message: "NIK tidak ditemukan" });
        }
      } catch (e) {
        console.error(e);
        setNikStatus("invalid");
        setNikData(null);
        setError("nik", { type: "manual", message: "Gagal cek NIK" });
      }
    },
    [isSales, clearErrors, setError]
  );

  useEffect(() => {
    if (debouncedNik !== "") {
      checkNik(debouncedNik);
    } else {
      setNikStatus(null);
      clearErrors("nik");
    }
  }, [debouncedNik, checkNik, clearErrors]);

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const visibleFields = useMemo(() => {
    if (isTSF) {
      return formFields.filter((f) => !["nik", "region"].includes(f.name));
    }

    if (isRegional) {
      return formFields.filter(
        (f) => !["branch", "is_employee", "tsf_type"].includes(f.name)
      );
    }

    return formFields.filter(
      (f) => !["is_employee", "tsf_type", "region"].includes(f.name)
    );
  }, [formFields, isTSF, isRegional]);

  const onSubmitInternal: SubmitHandler<FormValues> = (data) => {
    if (nikStatus === "invalid") {
      showErrorToast("NIK tidak valid. Harap periksa kembali.");
      return;
    }

    const payload = {
      ...data,
      role_id: Number((data.roles as { value: string }).value),
      branch_id: Number((data.branch as { value: string }).value),
      region_code: nikData?.organization_code || null,
    };

    onSubmit(payload);
  };

  return (
    <FormCreateUserView
      formFields={visibleFields}
      register={register}
      control={control}
      handleSubmit={handleSubmit}
      onSubmitInternal={onSubmitInternal}
      errors={errors}
      nikStatus={nikStatus}
      setNik={setNik}
      toggleShowPassword={toggleShowPassword}
      showPwdMap={showPwdMap}
      onClose={onClose}
    />
  );
};

export default FormCreateUserLogic;
