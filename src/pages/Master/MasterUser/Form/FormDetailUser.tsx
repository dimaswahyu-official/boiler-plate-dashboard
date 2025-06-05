import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "../../../../components/form/date-picker";
import { useUserStore } from "../../../../API/store/MasterStore/masterUserStore";
import { showErrorToast, showSuccessToast } from "../../../../components/toast";
import { usePagePermissions } from "../../../../utils/UserPermission/UserPagePermissions";

interface Option<T = string | number> {
  label: string;
  value: T;
}

interface FormDetailUserProps {
  defaultValues: {
    [x: string]: any;
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
  const { canUpdate, canManage } = usePagePermissions();

  const processedValues = {
    ...defaultValues,
    name: defaultValues.employee_name || "",
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
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: processedValues,
    mode: "onChange",
  });

  // Reset form ketika defaultValues berubah
  useEffect(() => {
    reset(processedValues);
  }, [defaultValues]);

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
  // useEffect(() => {
  //   if (isRegional) {
  //     setValue("branches", null);
  //     setValue("tsf_type", null);
  //     setValue("is_sales", defaultValues.is_sales ?? false);
  //   } else if (isTSF) {
  //     setValue("branches", null);
  //     setValue("regions", null);
  //     setValue("is_sales", defaultValues.is_sales ?? false);
  //   } else {
  //     setValue("regions", null);
  //     setValue("tsf_type", null);
  //   }
  // }, [labelRole, setValue, isRegional, isTSF]);

  const getChangedFields = (newData: any, originalData: any) => {
    const changes: Record<string, any> = {};
    for (const key in newData) {
      const newVal = newData[key];
      const origVal = originalData[key];

      if (typeof newVal === "object" && newVal !== null && "value" in newVal) {
        if (newVal.value !== origVal?.value) {
          changes[key] = newVal;
        }
      } else if (newVal !== origVal) {
        changes[key] = newVal;
      }
    }
    return changes;
  };

  const onSubmit = async (data: any) => {
    const validToIso = data.valid_to
      ? toIsoPreserveDate(new Date(data.valid_to))
      : "";

    const comparisonBase = {
      ...processedValues,
      valid_to: processedValues.valid_to
        ? toIsoPreserveDate(new Date(processedValues.valid_to))
        : "",
    };

    const changedFields = getChangedFields(data, comparisonBase);

    if (Object.keys(changedFields).length === 0) {
      showErrorToast("Tidak ada perubahan data.");
      return;
    }

    const payload = {
      role_id: data.roles?.value ?? null,
      branch_id: data.branches?.value ?? null,
      region_code: data.regions?.value ?? null,
      supervisor_number: data.nik_supervisor ?? null,
      phone: data.phone ?? null,
      is_active: data.is_active ?? false,
      is_sales: data.is_sales ?? false,
      valid_from: new Date().toISOString(),
      valid_to: validToIso,
      updated_by: "Superuser",
      name: data.name ?? null,
    };

    const employeeId = defaultValues.employee_id;

    const result = await updateUser(employeeId, payload);
    if (!result.ok) return;
    showSuccessToast("Berhasil memperbarui user");
    onClose();
  };

  const inputBaseClass = "w-full px-3 py-2 border rounded-md";
  const disabledClass = "bg-gray-100 text-gray-500";

  const onCancel = () => {
    reset(processedValues);
    setIsEditable(false);
  };

  // console.log("Default Values:", defaultValues);
  // console.log("Processed Values:", processedValues);
  // console.log("is_sales in processedValues:", processedValues.is_sales);

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            readOnly={!isEditable}
            className={`${inputBaseClass} ${!isEditable ? disabledClass : ""}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* ROLES */}
        <div>
          <label className="block text-sm font-medium mb-1">Roles</label>
          <Controller
            name="roles"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={optionRoles}
                value={field.value || processedValues.roles}
                isDisabled={!isEditable || isTSF}
                classNamePrefix={errors.roles ? "react-select-error" : ""}
              />
            )}
          />
          {errors.roles && (
            <p className="text-red-500 text-sm mt-1">
              {errors.roles.message as string}
            </p>
          )}
        </div>

        {/* NIK Karyawan */}
        <div>
          <label className="block text-sm font-medium mb-1">NIK Karyawan</label>
          <input
            type="text"
            {...register("nik")}
            readOnly
            className={`${inputBaseClass} ${disabledClass}`}
          />
        </div>

        {/* NIK Supervisor */}
        {!isRegional && (
          <div>
            <label className="block text-sm font-medium mb-1">
              NIK Supervisor
            </label>
            <input
              type="text"
              {...register("nik_supervisor", {
                required: "NIK Supervisor is required",
              })}
              readOnly={!isEditable}
              className={`${inputBaseClass} ${
                !isEditable ? disabledClass : ""
              }`}
            />
            {errors.nik_supervisor && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nik_supervisor.message as string}
              </p>
            )}
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^\d{10,14}$/,
                message: "Phone number must be between 10 to 14 digits",
              },
            })}
            readOnly={!isEditable}
            className={`${inputBaseClass} ${!isEditable ? disabledClass : ""}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone.message as string}
            </p>
          )}
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

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            readOnly={!isEditable}
            className={`${inputBaseClass} ${!isEditable ? disabledClass : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message as string}
            </p>
          )}
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
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={!!field.value} // Pastikan boolean
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!isEditable}
                className="w-5 h-5"
              />
            )}
          />
        </div>

        {/* Is Sales */}
        {showIsSales && (
          <div>
            <label className="block text-sm font-medium mb-1">Is Sales</label>
            <Controller
              name="is_sales"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={!isEditable}
                  className="w-5 h-5"
                />
              )}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          {isEditable ? (
            <>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Batal
              </button>
            </>
          ) : (
            canUpdate && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditable(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Update
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailUser;
