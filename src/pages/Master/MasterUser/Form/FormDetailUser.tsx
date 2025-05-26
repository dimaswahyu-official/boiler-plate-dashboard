import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../../../../components/form/date-picker";

interface FormDetailUserProps {
  defaultValues: {
    region_code: any;
    employee_id: any;
    salesrep_name: any;
    employee_name: any;
    name?: string;
    nik?: string;
    phone?: string;
    role_id?: number;
    branch_id?: number;
    nik_supervisor?: string;
    roles?: Array<{ label: string; value: string }>;
    branches?: Array<{ label: string; value: string }>;
    regions?: Array<{ label: string; value: string }>;
    email?: string;
    created_at?: string;
    valid_to?: string;
    is_active?: boolean;
  };
  onClose: () => void;
  formFields: Array<any>;
  optionRoles: Array<{ value: number; label: string }>;
  optionBranch: Array<{ value: number; label: string }>;
  optionRegion: Array<any>;
}

const FormDetailUser: React.FC<FormDetailUserProps> = ({
  defaultValues,
  onClose,
  optionRoles,
  optionBranch,
  optionRegion,
}) => {
  const [isEditable, setIsEditable] = useState(false);

  const processedValues = {
    ...defaultValues,
    name: defaultValues.salesrep_name || defaultValues.employee_name || "null",
    nik: defaultValues.employee_id || "null",
    nik_supervisor: defaultValues.nik_supervisor || "null",
    phone: defaultValues.phone || "null",
    roles: defaultValues.role_id
      ? optionRoles.find((role) => role.value === defaultValues.role_id)
      : null,
    branches: defaultValues.branch_id
      ? optionBranch.find((branch) => branch.value === defaultValues.branch_id)
      : null,
    regions: defaultValues.region_code
      ? optionBranch.find(
          (branch) => branch.value === defaultValues.region_code
        )
      : null,
    created_at: defaultValues.created_at
      ? new Date(defaultValues.created_at).toISOString().split("T")[0]
      : "N/A",
    valid_to: defaultValues.valid_to
      ? new Date(defaultValues.valid_to).toISOString().split("T")[0]
      : "N/A",
  };

  const { register, control, handleSubmit } = useForm({
    defaultValues: processedValues,
  });

  const onSubmit = (data: any) => {
    console.log("Updated Data:", data);
    // Lakukan sesuatu dengan data yang diupdate, seperti mengirim ke API
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name")}
            readOnly={!isEditable} // Kontrol readonly berdasarkan state
            className={`w-full px-3 py-2 border rounded-md ${
              isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium mb-1">Roles</label>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={optionRoles}
                value={field.value || processedValues.roles}
                isDisabled={!isEditable} // Kontrol disabled berdasarkan state
                className={isEditable ? "" : "bg-gray-100 text-gray-500"}
              />
            )}
          />
        </div>

        {/* NIK Karyawan */}
        <div>
          <label className="block text-sm font-medium mb-1">NIK Karyawan</label>
          <input
            type="text"
            {...register("nik")}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500"
          />
        </div>

        {/* NIK Supervisor */}
        <div>
          <label className="block text-sm font-medium mb-1">
            NIK Supervisor
          </label>
          <input
            type="text"
            {...register("nik_supervisor")}
            readOnly={!isEditable}
            className={`w-full px-3 py-2 border rounded-md ${
              isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            {...register("phone")}
            readOnly={!isEditable}
            className={`w-full px-3 py-2 border rounded-md ${
              isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium mb-1">Branch</label>
          <Controller
            name="branches"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={optionBranch}
                value={field.value || processedValues.branches}
                isDisabled={!isEditable}
                className={isEditable ? "" : "bg-gray-100 text-gray-500"}
              />
            )}
          />
        </div>

        {/* region */}
        <div>
          <label className="block text-sm font-medium mb-1">Region</label>
          <Controller
            name="regions"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={optionRegion}
                value={field.value || processedValues.regions}
                isDisabled={!isEditable}
                className={isEditable ? "" : "bg-gray-100 text-gray-500"}
              />
            )}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            readOnly={!isEditable}
            className={`w-full px-3 py-2 border rounded-md ${
              isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* Valid To */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tanggal Berakhir
          </label>
          <Controller
            name="valid_to"
            control={control}
            render={({ field }) => (
              <DatePicker
                id="valid-to"
                {...field}
                defaultDate={
                  field.value || processedValues.valid_to || undefined
                }
                onChange={(date) => field.onChange(date)}
                readOnly={!isEditable} // Kontrol readonly berdasarkan state
              />
            )}
          />
        </div>

        {/* Is Active */}
        <div>
          <label className="block text-sm font-medium mb-1">Is Active</label>
          <input
            type="checkbox"
            {...register("is_active")}
            disabled={!isEditable} // Kontrol disabled berdasarkan state
            className="w-5 h-5"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Close
          </button>
          {!isEditable ? (
            <button
              type="button"
              onClick={() => setIsEditable(true)} // Aktifkan mode edit
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailUser;

// const FormDetailUser: React.FC<FormDetailUserProps> = ({
//   defaultValues,
//   onClose,
//   optionRoles,
//   optionBranch,
// }) => {
//   // Proses defaultValues untuk menentukan nilai name dan nik
//   const processedValues = {
//     ...defaultValues,
//     name: defaultValues.salesrep_name || defaultValues.employee_name || "null",
//     nik: defaultValues.employee_id || "null",
//     nik_supervisor: defaultValues.nik_supervisor || "null",
//     phone: defaultValues.phone || "null",
//     roles: defaultValues.role_id
//       ? optionRoles.find((role) => role.value === defaultValues.role_id)
//       : null,
//     branches: defaultValues.branch_id
//       ? optionBranch.find((branch) => branch.value === defaultValues.branch_id)
//       : null,
//     created_at: defaultValues.created_at
//       ? new Date(defaultValues.created_at).toISOString().split("T")[0]
//       : "N/A", // Format tanggal dibuat
//     valid_to: defaultValues.valid_to
//       ? new Date(defaultValues.valid_to).toISOString().split("T")[0]
//       : "N/A",
//   };

//   //   console.log("defaultValues", defaultValues);

//   const { register, control } = useForm({
//     defaultValues: processedValues,
//   });

//   const commonClasses =
//     "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100 text-gray-500";

//   return (
//     <div className="p-6 bg-white rounded-md shadow-md">
//       <form className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Name</label>
//           <input
//             type="text"
//             {...register("name")}
//             readOnly
//             className={commonClasses}
//           />
//         </div>

//         {/* Roles */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Roles</label>
//           <Controller
//             name="roles"
//             control={control}
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 options={optionRoles}
//                 value={field.value || processedValues.roles}
//                 isDisabled={true}
//               />
//             )}
//           />
//         </div>

//         {/* NIK */}
//         <div>
//           <label className="block text-sm font-medium mb-1">NIK</label>
//           <input
//             type="text"
//             {...register("nik")}
//             readOnly
//             className={commonClasses}
//           />
//         </div>

//         {/* NIK SPV */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             NIK Supervisor
//           </label>
//           <input
//             type="text"
//             {...register("nik_supervisor")}
//             readOnly
//             className={commonClasses}
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Phone
//           </label>
//           <input
//             type="text"
//             {...register("phone")}
//             readOnly
//             className={commonClasses}
//           />
//         </div>

//         {/* Branch */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Branch</label>
//           <Controller
//             name="branches"
//             control={control}
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 options={optionBranch}
//                 value={field.value || processedValues.branches}
//                 isDisabled
//               />
//             )}
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <input
//             type="email"
//             {...register("email")}
//             readOnly
//             className={commonClasses}
//           />
//         </div>

//         {/* Join Date */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Tanggal Dibuat
//           </label>
//           <Controller
//             name="created_at"
//             control={control}
//             render={({ field }) => (
//               <DatePicker
//                 id="created_at"
//                 {...field}
//                 defaultDate={
//                   field.value || processedValues.created_at || undefined
//                 }
//                 onChange={(date) => field.onChange(date)}
//                 readOnly={true}
//               />
//             )}
//           />
//         </div>

//         {/* End Date */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             Tanggal Berakhir
//           </label>
//           <Controller
//             name="valid_to"
//             control={control}
//             render={({ field }) => (
//               <DatePicker
//                 id="valid-to"
//                 {...field}
//                 defaultDate={
//                   field.value || processedValues.valid_to || undefined
//                 }
//                 onChange={(date) => field.onChange(date)}
//                 readOnly={true}
//               />
//             )}
//           />
//         </div>

//         {/* Is Active */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Is Active</label>
//           <input
//             type="checkbox"
//             {...register("is_active")}
//             disabled
//             className="w-5 h-5"
//           />
//         </div>

//         {/* Close Button */}
//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded-md"
//           >
//             Close
//           </button>
//           <button
//             type="button"
//             className="px-4 py-2 bg-blue-500 text-white rounded-md"
//           >
//             Update
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormDetailUser;
