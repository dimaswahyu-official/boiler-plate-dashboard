import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../../components/form/date-picker";
import Button from "../ui/button/Button";

type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "file" | "date";
  options?: { value: string | boolean; label: string }[];
  validation?: {
    required?: boolean | string;
    [key: string]: any;
  };
};

type FormValues = Record<string, any>;

type FormInputProps = {
  formFields: FormField[];
  onSubmit: SubmitHandler<FormValues>;
  onClose: () => void;
  defaultValues?: FormValues;
};

const FormInput: React.FC<FormInputProps> = ({
  formFields,
  onSubmit,
  onClose,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues,
  });

  const [nikStatus, setNikStatus] = useState<
    "valid" | "invalid" | "checking" | null
  >(null);

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleSubmit = (data: FormValues) => {
    console.log("Form Data:", data); // Log data yang dikirimkan
    onSubmit(data); // Kirim data ke parent
  };

  const checkNik = async (nik: string) => {
    setNikStatus("checking"); // Set status menjadi "checking"
    try {
      const response = await fetch(`/api/check-nik?nik=${nik}`);
      const data = await response.json();

      if (data.exists) {
        setNikStatus("valid"); // Jika NIK ditemukan
      } else {
        setNikStatus("invalid"); // Jika NIK tidak ditemukan
      }
    } catch (error) {
      console.error("Error checking NIK:", error);
      setNikStatus("invalid"); // Set status menjadi "invalid" jika terjadi error
    }
  };

  const renderField = (field: FormField) => {
    const commonClasses =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...register(field.name, field.validation)}
            className={commonClasses}
          />
        );
      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{
              validate: (value) =>
                (value !== undefined && value !== null) ||
                field.validation?.required,
            }}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                options={field.options}
                placeholder="Select an option"
                className="react-select-container"
                classNamePrefix="react-select"
                value={field.options?.find(
                  (option) => option.value === controllerField.value
                )} // Pastikan nilai default ditampilkan
                onChange={(selectedOption) => {
                  const value =
                    selectedOption?.value === false
                      ? false
                      : selectedOption?.value; // Pastikan false diteruskan sebagai boolean
                  controllerField.onChange(value); // Perbarui nilai dengan benar
                }}
                menuPlacement="auto" // Otomatis buka ke atas jika ruang tidak cukup ke bawah
              />
            )}
          />
        );
      case "file":
        return (
          <input
            type="file"
            {...register(field.name, field.validation)}
            className={commonClasses}
          />
        );
      case "date":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: controllerField }) => (
              <DatePicker
                id="date-picker"
                placeholder="Select a date"
                onChange={(date: Date | Date[]) =>
                  controllerField.onChange(Array.isArray(date) ? date[0] : date)
                }
              />
            )}
          />
        );
      case "text":
        if (field.name === "nik") {
          return (
            <div>
              <input
                type="text"
                {...register(field.name, field.validation)}
                className={commonClasses}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length === 5) {
                    checkNik(value); // Panggil fungsi validasi NIK
                  } else if (value.length > 5) {
                    setNikStatus("invalid"); // Set status menjadi invalid jika lebih dari 5 karakter
                  } else {
                    setNikStatus(null); // Reset status jika kurang dari 5 karakter
                  }
                }}
              />
              {nikStatus === "checking" && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                  <span>Checking...</span>
                </div>
              )}
              {nikStatus === "valid" && (
                <span style={{ color: "green", fontSize: "13px" }}>
                  NIK valid
                </span>
              )}
              {nikStatus === "invalid" && (
                <span style={{ color: "red", fontSize: "13px" }}>
                  {field.name.length > 5
                    ? "NIK tidak boleh lebih dari 5 digit"
                    : "NIK tidak ditemukan"}
                </span>
              )}
            </div>
          );
        }
        return (
          <input
            type={field.type}
            {...register(field.name, field.validation)}
            className={commonClasses}
          />
        );
      default:
        return (
          <input
            type={field.type}
            {...register(field.name, field.validation)}
            className={commonClasses}
          />
        );
    }
  };

  // Split fields into two columns only if there are more than 6 fields
  const leftFields =
    formFields.length > 6
      ? formFields.slice(0, Math.ceil(formFields.length / 2))
      : formFields;
  const rightFields =
    formFields.length > 6
      ? formFields.slice(Math.ceil(formFields.length / 2))
      : [];

  return (
    <div className="mx-auto mt-10 p-6 rounded-md">
      <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
        <div
          className={`grid ${
            formFields.length > 6 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          } gap-6`}
        >
          <div>
            {leftFields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                {renderField(field)}
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors[field.name] as any).message}
                  </p>
                )}
              </div>
            ))}
          </div>
          {rightFields.length > 0 && (
            <div>
              {rightFields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {(errors[field.name] as any).message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-10">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormInput;
