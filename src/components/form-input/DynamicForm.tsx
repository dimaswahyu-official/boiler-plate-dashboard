import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

export interface Option {
  value: string;
  label: string;
}

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: Option[]; // hanya untuk select
};

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>; // Tambahkan defaultValues
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  defaultValues = {}, // Default ke objek kosong jika tidak ada
}) => {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues, // Gunakan defaultValues untuk mengisi nilai awal
  });

  React.useEffect(() => {
    reset(defaultValues); // Reset form jika defaultValues berubah
  }, [reset, JSON.stringify(defaultValues)]);

  const commonClasses =
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>

          {field.type === "text" && field.name === "name" && (
            <input
              type="text"
              {...register(field.name)}
              className={commonClasses}
              style={{ textTransform: "uppercase" }}
            />
          )}

          {field.type === "text" && field.name !== "name" && (
            <input
              type="text"
              {...register(field.name)}
              className={commonClasses}
            />
          )}

          {field.type === "textarea" && (
            <textarea {...register(field.name)} className={commonClasses} />
          )}

          {field.type === "select" && field.options && (
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <Select
                  {...controllerField}
                  options={field.options}
                  className="mt-1"
                  classNamePrefix="react-select"
                />
              )}
            />
          )}
        </div>
      ))}
    </form>
  );
};

export default DynamicForm;
