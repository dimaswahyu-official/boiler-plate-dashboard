import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InfoTambahan, InfoTagihan, InfoPembayaranTagihan } from "./TabInfo";
import Select from "react-select";

interface Field {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
}

interface CustomerFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
}

function CustomerForm({ fields, onSubmit }: CustomerFormProps) {
  const { handleSubmit, control } = useForm();
  const [activeTab, setActiveTab] = useState("Info Tambahan");

  const commonClasses =
    "col-span-2 w-full px-3 py-2 border rounded-md text-gray-500 focus:outline-none focus:ring focus:ring-blue-300";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Info Pelanggan */}
      <div className="border-2 border-orange-300 rounded-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Info Pelanggan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.slice(0, 8).map((field) => (
            <div
              key={field.name}
              className="grid grid-cols-3 items-center gap-2"
            >
              <label className="text-sm font-semibold col-span-1">
                {field.label}
              </label>
              <Controller
                name={field.name}
                control={control}
                defaultValue={field.defaultValue || ""}
                render={({ field: controllerField }) => (
                  <input
                    {...controllerField}
                    type="text"
                    className={commonClasses}
                    readOnly
                  />
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Info Lokasi */}
      <div className="border-2 border-orange-300 rounded-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Info Lokasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.slice(8).map((field) => (
            <div
              key={field.name}
              className="grid grid-cols-3 items-center gap-2"
            >
              <label className="text-sm font-semibold col-span-1">
                {field.label}
              </label>
              <Controller
                name={field.name}
                control={control}
                defaultValue={field.defaultValue || ""}
                render={({ field: controllerField }) =>
                  field.type === "select" ? (
                    <Select
                      {...controllerField}
                      options={[
                        { value: "Option1", label: "Option 1" },
                        { value: "Option2", label: "Option 2" },
                      ]}
                      isDisabled
                      classNamePrefix="react-select"
                    />
                  ) : field.type === "textarea" ? (
                    <textarea
                      {...controllerField}
                      className={commonClasses}
                      rows={3}
                      readOnly
                    />
                  ) : (
                    <input
                      {...controllerField}
                      type="text"
                      className={commonClasses}
                      readOnly
                    />
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-2 border-orange-300 rounded-md p-4 mb-6">
        <div className="flex justify-center">
          {["Info Tambahan", "Info Tagihan", "Pembayaran Tagihan"].map(
            (tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xl text-center text-2xl ${
                  activeTab === tab
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
        <div className="p-4 mt-8">
          {activeTab === "Info Tambahan" && <InfoTambahan />}
          {activeTab === "Info Tagihan" && <InfoTagihan />}
          {activeTab === "Pembayaran Tagihan" && <InfoPembayaranTagihan />}
        </div>
      </div>

      {/* Info Rute Section */}
      <div className="border-2 border-orange-300 rounded-md p-4">
        <h2 className="text-xl font-semibold mb-2">Info Rute</h2>
        <div className="border p-4 rounded-md">
          <p className="font-semibold">JATRTM0001</p>
          <p>BUDDI APRIANSYAH</p>
          <p>080801.01807B0 - BUDDI APRIANSYAH</p>
        </div>
      </div>
    </form>
  );
}

export default CustomerForm;
