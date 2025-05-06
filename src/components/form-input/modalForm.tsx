import React, { useEffect } from "react";
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

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleSubmit = (data: FormValues) => {
    console.log("Form Data:", data); // Log data yang dikirimkan
    onSubmit(data); // Kirim data ke parent
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
                // styles={{
                //   container: (provided) => ({
                //     ...provided,
                //     marginBottom: "50px", // Add 5px margin below the select
                //   }),
                // }}
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
