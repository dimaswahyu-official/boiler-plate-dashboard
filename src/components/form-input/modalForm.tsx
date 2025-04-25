import React, { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";

type FormField = {
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "number" | "file";
    options?: { value: string; label: string }[];
    validation?: object;
};

type FormValues = Record<string, any>;

type FormInputProps = {
    formFields: FormField[];
    onSubmit: SubmitHandler<FormValues>;
    onClose: () => void;
    defaultValues?: FormValues;
  };
  
const FormInput: React.FC<FormInputProps> = ({ formFields, onSubmit, onClose, defaultValues }) => {
    const {
        register,
        handleSubmit,
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
                        rules={field.validation}
                        render={({ field: controllerField }) => (
                            <Select
                                {...controllerField}
                                options={field.options}
                                placeholder="Select an option"
                                className="react-select-container"
                                classNamePrefix="react-select"
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

    
    return (
        <div className="mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {formFields.map((field) => (
                    <div key={field.name}>
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
