import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../../../../components/form/date-picker";
import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
import { showSuccessToast } from "../../../../components/toast";

interface Option<T = string | number> {
  label: string;
  value: T;
}

interface FormDetailUserProps {
  defaultValues: {
    supervisor_number: string;
    region_code: any;
    employee_id: any;
    salesrep_name: any;
    employee_name: any;
    name?: string;
    nik?: string;
    phone?: string;
    role_id?: number;
    branch_id?: number;
    tsf_type?: "Internal" | "External";
    email?: string;
    created_at?: string;
    valid_to?: string;
    is_active?: boolean;
    is_sales?: boolean;
  };
  onClose: () => void;
  formFields: Array<any>;
  optionRoles: Option<number>[];
  optionBranch: Option<number>[];
  optionRegion: Option<string>[];
}

const ROLE_REGIONAL = "REGIONAL";
const ROLE_TSF = "TSF";
const ROLE_SALESMAN = "SALESMAN";

const optionTSFType: Option<string>[] = [
  { value: "Internal", label: "Internal" },
  { value: "External", label: "External" },
];

const FormDetailUser: React.FC<FormDetailUserProps> = ({
  defaultValues,
  onClose,
  optionRoles,
  optionBranch,
  optionRegion,
}) => {
  const { updateUser } = useUserStore();
  const [isEditable, setIsEditable] = useState(false);

  const processedValues = {
    ...defaultValues,
    name: defaultValues.salesrep_name || defaultValues.employee_name || "",
    nik: defaultValues.employee_id || "",
    nik_supervisor: defaultValues.supervisor_number || "",
    phone: defaultValues.phone || "",
    roles: defaultValues.role_id
      ? optionRoles.find((r) => r.value === defaultValues.role_id) || null
      : null,
    branches: defaultValues.branch_id
      ? optionBranch.find((b) => b.value === defaultValues.branch_id) || null
      : null,
    regions: defaultValues.region_code
      ? optionRegion.find((r) => r.value === defaultValues.region_code) || null
      : null,
    tsf_type: defaultValues.tsf_type
      ? optionTSFType.find((o) => o.value === defaultValues.tsf_type) || null
      : null,
    created_at: defaultValues.created_at
      ? new Date(defaultValues.created_at).toISOString().split("T")[0]
      : "",
    valid_to: defaultValues.valid_to
      ? new Date(defaultValues.valid_to).toISOString().split("T")[0]
      : "",
    is_active: defaultValues.is_active ?? false,
    is_sales: defaultValues.is_sales ?? false,
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm({ defaultValues: processedValues });

  const toIsoPreserveDate = (local: Date): string =>
    new Date(
      Date.UTC(
        local.getFullYear(),
        local.getMonth(),
        local.getDate(),
        0,
        0,
        0,
        0
      )
    ).toISOString();

  const watchedRole = watch("roles", processedValues.roles);
  const labelRole = watchedRole?.label ?? "";

  const isRegional = labelRole === ROLE_REGIONAL;
  const isTSF = labelRole === ROLE_TSF;
  const isSalesman = labelRole === ROLE_SALESMAN;
  const showIsSales = !isSalesman && !isTSF;

  // Reset fields on role change
  useEffect(() => {
    if (isRegional) {
      setValue("branches", null);
      setValue("tsf_type", null);
      setValue("is_sales", false);
    } else if (isTSF) {
      setValue("branches", null);
      setValue("regions", null);
      setValue("is_sales", false);
    } else {
      setValue("regions", null);
      setValue("tsf_type", null);
    }
  }, [labelRole, setValue, isRegional, isTSF]);

  const onSubmit = async (data: any) => {
    const employeeId = defaultValues.employee_id;
    const validToIso = data.valid_to
      ? toIsoPreserveDate(new Date(data.valid_to))
      : "";

    const payload = {
      role_id: Number(watchedRole?.value) ?? 0,
      branch_id: !isRegional && !isTSF ? data.branches?.value ?? "" : "",
      region_code: isRegional ? data.regions?.value ?? "" : "",
      // tsf_type: isTSF ? data.tsf_type?.value ?? "" : "",
      supervisor_number: data.nik_supervisor ?? "",
      phone: data.phone ?? "",
      is_active: data.is_active ?? false,
      is_sales: showIsSales ? data.is_sales ?? false : false,
      valid_from: new Date().toISOString(),
      valid_to: validToIso,
      updated_by: "Superuser",
      name: data.name ?? "",
    };

    const result = await updateUser(employeeId, payload);
    if (!result.ok) return;
    showSuccessToast("Berhasil memperbarui user");
    onClose();
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name")}
            readOnly={!isEditable}
            className={`w-full px-3 py-2 border rounded-md ${
              isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
            }`}
          />
        </div>

        {/* ROLES */}
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
                isDisabled={!isEditable || isTSF} // Disable if not editable or role is TSF
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
        {!isRegional && !isTSF && (
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
                />
              )}
            />
          </div>
        )}

        {/* Region */}
        {isRegional && (
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
                />
              )}
            />
          </div>
        )}

        {/* TSF Type */}
        {/* {isTSF && (
          <div>
            <label className="block text-sm font-medium mb-1">TSF Type</label>
            <Controller
              name="tsf_type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={optionTSFType}
                  value={field.value || processedValues.tsf_type}
                  isDisabled={!isEditable}
                />
              )}
            />
          </div>
        )} */}

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
                defaultDate={field.value || processedValues.valid_to}
                onChange={(date) => field.onChange(date)}
                readOnly={!isEditable}
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
            disabled={!isEditable}
            className="w-5 h-5"
          />
        </div>

        {/* Is Sales */}
        {showIsSales && (
          <div>
            <label className="block text-sm font-medium mb-1">Is Sales</label>
            <input
              type="checkbox"
              {...register("is_sales")}
              disabled={!isEditable}
              className="w-5 h-5"
            />
          </div>
        )}

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
              onClick={(e) => {
                e.preventDefault(); // ⛔ Mencegah aksi baku yang memicu submit
                setIsEditable(true); // ✅ Aktifkan mode edit
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Update
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isDirty}
              className={`px-4 py-2 rounded-md text-white ${
                isDirty ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
              }`}
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

// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import DatePicker from "../../../../components/form/date-picker";
// import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
// import { showSuccessToast } from "../../../../components/toast";

// interface FormDetailUserProps {
//   defaultValues: {
//     supervisor_number: string;
//     region_code: any;
//     employee_id: any;
//     salesrep_name: any;
//     employee_name: any;
//     name?: string;
//     nik?: string;
//     phone?: string;
//     role_id?: number;
//     branch_id?: number;
//     roles?: Array<{ label: string; value: string }>;
//     branches?: Array<{ label: string; value: string }>;
//     regions?: Array<{ label: string; value: string }>;
//     email?: string;
//     created_at?: string;
//     valid_to?: string;
//     is_active?: boolean;
//     is_sales?: boolean;
//   };
//   onClose: () => void;
//   formFields: Array<any>;
//   optionRoles: Array<{ value: number; label: string }>;
//   optionBranch: Array<{ value: number; label: string }>;
//   optionRegion: Array<any>;
// }

// const ROLE_REGIONAL = "REGIONAL";
// const ROLE_TSF = "TSF";

// const FormDetailUser: React.FC<FormDetailUserProps> = ({
//   defaultValues,
//   onClose,
//   optionRoles,
//   optionBranch,
//   optionRegion,
// }) => {
//   const { updateUser } = useUserStore();
//   const [isEditable, setIsEditable] = useState(false);

//   const processedValues = {
//     ...defaultValues,
//     name: defaultValues.salesrep_name || defaultValues.employee_name || "null",
//     nik: defaultValues.employee_id || "null",
//     nik_supervisor: defaultValues.supervisor_number || "null",
//     phone: defaultValues.phone || "null",
//     roles: defaultValues.role_id
//       ? optionRoles.find((role) => role.value === defaultValues.role_id)
//       : null,
//     branches: defaultValues.branch_id
//       ? optionBranch.find((branch) => branch.value === defaultValues.branch_id)
//       : null,
//     regions: defaultValues.region_code
//       ? optionBranch.find(
//           (branch) => branch.value === defaultValues.region_code
//         )
//       : null,
//     created_at: defaultValues.created_at
//       ? new Date(defaultValues.created_at).toISOString().split("T")[0]
//       : "N/A",
//     valid_to: defaultValues.valid_to
//       ? new Date(defaultValues.valid_to).toISOString().split("T")[0]
//       : "N/A",
//   };

//   const { register, control, handleSubmit } = useForm({
//     defaultValues: processedValues,
//   });

//   function toIsoPreserveDate(local: Date): string {
//     return new Date(
//       Date.UTC(
//         local.getFullYear(), // ambil komponen lokal
//         local.getMonth(), // bulan: 0-based
//         local.getDate(), // tanggal
//         0,
//         0,
//         0,
//         0 // jam 00:00 UTC
//       )
//     ).toISOString(); // hasilnya pasti “…31T00:00:00.000Z”
//   }

//   const onSubmit = async (data: any) => {
//     const employeeId = data.employee_id;

//     const validToIso = data.valid_to
//       ? toIsoPreserveDate(new Date(data.valid_to))
//       : null;

//     const payload = {
//       role_id: data.roles?.value || "",
//       branch_id: data.branches?.value || "",
//       region_code: data.regions?.value || "",
//       supervisor_number: data.nik_supervisor || "",
//       phone: data.phone || "",
//       is_active: data.is_active || false,
//       is_sales: true,
//       valid_from: new Date().toISOString() || "",
//       valid_to: validToIso || "",
//       updated_by: "Superuser",
//       name: data.name || "",
//     };

//     const result = await updateUser(employeeId, payload);
//     if (!result.ok) {
//       return;
//     }
//     showSuccessToast("Berhasil tambah user");
//     onClose();
//   };

//   return (
//     <div className="p-6 bg-white rounded-md shadow-md">
//       <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Name</label>
//           <input
//             type="text"
//             {...register("name")}
//             readOnly={!isEditable} // Kontrol readonly berdasarkan state
//             className={`w-full px-3 py-2 border rounded-md ${
//               isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
//             }`}
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
//                 isDisabled={!isEditable} // Kontrol disabled berdasarkan state
//                 className={isEditable ? "" : "bg-gray-100 text-gray-500"}
//               />
//             )}
//           />
//         </div>

//         {/* NIK Karyawan */}
//         <div>
//           <label className="block text-sm font-medium mb-1">NIK Karyawan</label>
//           <input
//             type="text"
//             {...register("nik")}
//             readOnly
//             className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500"
//           />
//         </div>

//         {/* NIK Supervisor */}
//         <div>
//           <label className="block text-sm font-medium mb-1">
//             NIK Supervisor
//           </label>
//           <input
//             type="text"
//             {...register("nik_supervisor")}
//             readOnly={!isEditable}
//             className={`w-full px-3 py-2 border rounded-md ${
//               isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
//             }`}
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Phone</label>
//           <input
//             type="text"
//             {...register("phone")}
//             readOnly={!isEditable}
//             className={`w-full px-3 py-2 border rounded-md ${
//               isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
//             }`}
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
//                 isDisabled={!isEditable}
//                 className={isEditable ? "" : "bg-gray-100 text-gray-500"}
//               />
//             )}
//           />
//         </div>

//         {/* region */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Region</label>
//           <Controller
//             name="regions"
//             control={control}
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 options={optionRegion}
//                 value={field.value || processedValues.regions}
//                 isDisabled={!isEditable}
//                 className={isEditable ? "" : "bg-gray-100 text-gray-500"}
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
//             readOnly={!isEditable}
//             className={`w-full px-3 py-2 border rounded-md ${
//               isEditable ? "bg-white" : "bg-gray-100 text-gray-500"
//             }`}
//           />
//         </div>

//         {/* Valid To */}
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
//                 defaultDate={field.value || processedValues.valid_to}
//                 onChange={(date) => field.onChange(date)}
//                 readOnly={!isEditable} // Kontrol readonly berdasarkan state
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
//             disabled={!isEditable} // Kontrol disabled berdasarkan state
//             className="w-5 h-5"
//           />
//         </div>

//         {/* Buttons */}
//         {/* Buttons */}
//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 rounded-md"
//           >
//             Close
//           </button>

//           {!isEditable ? (
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault(); // ⛔ Mencegah aksi baku yang memicu submit
//                 setIsEditable(true); // ✅ Aktifkan mode edit
//               }}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Update
//             </button>
//           ) : (
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-500 text-white rounded-md"
//             >
//               Save
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormDetailUser;
