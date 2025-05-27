import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../../../../components/form/date-picker";
import Button from "../../../../components/ui/button/Button";
import Checkbox from "../../../../components/form/input/Checkbox";
// import PasswordField from "./PasswordField"; // Pastikan PasswordField diimpor jika digunakan

const FormCreateUserView = ({
  formFields,
  register,
  control,
  handleSubmit,
  onSubmitInternal,
  errors,
  nikStatus,
  setNik,
  toggleShowPassword,
  showPwdMap,
  onClose,
  isTSF,
  isRegional,
}: any) => {
    
  // Fungsi untuk merender field berdasarkan tipe
  const renderField = (field: any) => {
    // Logika visibilitas field
    if (
      (field.name === "nik" && isTSF) || // Sembunyikan NIK jika TSF
      (field.name === "is_employee" && (!isTSF || isRegional)) || // Sembunyikan is_employee jika bukan TSF atau REGIONAL
      (field.name === "tsf_type" && (!isTSF || isRegional)) || // Sembunyikan tsf_type jika bukan TSF atau REGIONAL
      (field.name === "branch" && isRegional) || // Sembunyikan branch jika REGIONAL
      (field.name === "region" && !isRegional) // Sembunyikan region jika bukan REGIONAL
    ) {
      return null;
    }

    // Render field berdasarkan tipe
    switch (field.type) {
      case "text":
        if (field.name === "nik") {
          return (
            <>
              <input
                {...register(field.name, field.validation)}
                className="w-full px-3 py-2 border rounded-md"
                onChange={(e) => {
                  const val = e.target.value.trim();
                  setNik(val); // Update state NIK
                }}
              />
              {nikStatus === "valid" && (
                <p className="text-sm text-green-500">NIK valid</p>
              )}
              {nikStatus === "checking" && (
                <p className="text-sm text-yellow-500">Checking NIK...</p>
              )}
              {errors[field.name] && (
                <p className="text-sm text-red-500">
                  {errors[field.name]?.message}
                </p>
              )}
            </>
          );
        }
        return (
          <input
            {...register(field.name, field.validation)}
            className="w-full px-3 py-2 border rounded-md"
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

      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: c }) => (
              <Select
                {...c}
                options={field.options}
                classNamePrefix="react-select"
              />
            )}
          />
        );

      case "date":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: c }) => (
              <DatePicker
                id={`${field.name}-date-picker`}
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

      default:
        return (
          <input
            {...register(field.name, field.validation)}
            className="w-full px-3 py-2 border rounded-md"
          />
        );
    }
  };

  return (
    <div className="mx-auto mt-10 p-6 rounded-md">
      <form onSubmit={handleSubmit(onSubmitInternal)} className="space-y-4">
        {formFields.map((field: any) => (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}

        <div className="flex justify-end gap-2 mt-10">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default FormCreateUserView;
