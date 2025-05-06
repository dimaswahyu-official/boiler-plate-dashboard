import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import DynamicForm, {
  FieldConfig as BaseFieldConfig,
} from "../../../../components/form-input/dynamicForm";
import CustomerForm from "./customerForm";

type FieldConfig = BaseFieldConfig & {
  defaultValue?: any;
};

function DetailCustomerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const custData = location.state?.custData; // Ambil custData dari state

  const fields: FieldConfig[] = [
    {
      name: "cust_account_id",
      label: "ID Pelanggan",
      type: "text",
      defaultValue: custData?.cust_account_id,
    },
    {
      name: "npwp",
      label: "NPWP",
      type: "text",
      defaultValue: custData?.npwp,
    },
    {
      name: "ktp",
      label: "KTP",
      type: "text",
      defaultValue: custData?.ktp,
    },
    {
      name: "phone",
      label: "No telepon",
      type: "text",
      defaultValue: custData?.phone,
    },
    {
      name: "customer_number",
      label: "Kode Pelanggan",
      type: "text",
      defaultValue: custData?.customer_number,
    },
    {
      name: "name",
      label: "Nama Pelanggan",
      type: "text",
      defaultValue: custData?.name,
    },
    {
      name: "alias",
      label: "Nama Alias",
      type: "text",
      defaultValue: custData?.alias,
    },
    {
      name: "owner",
      label: "Owner",
      type: "text",
      defaultValue: custData?.owner,
    },
    {
      name: "owner",
      label: "Owner",
      type: "text",
      defaultValue: custData?.owner,
    },
    {
      name: "provinsi",
      label: "Provinsi",
      type: "text",
      defaultValue: custData?.addresses?.[0]?.provinsi,
    },
    {
      name: "kab_kodya",
      label: "Kabupaten",
      type: "text",
      defaultValue: custData?.addresses?.[0]?.kab_kodya,
    },
    {
      name: "kecamatan",
      label: "Kecamatan",
      type: "text",
      defaultValue: custData?.addresses?.[0]?.kecamatan,
    },
    {
      name: "kelurahan",
      label: "Kelurahan",
      type: "text",
      defaultValue: custData?.addresses?.[0]?.kelurahan,
    },
    {
      name: "kodepos",
      label: "Kode Pos",
      type: "text",
      defaultValue: custData?.addresses?.[0]?.kodepos,
    },
    {
      name: "address1",
      label: "Alamat",
      type: "textarea",
      defaultValue: custData?.addresses?.[0]?.address1,
    },
    {
      name: "latitude",
      label: "Latitude",
      type: "text",
      defaultValue: custData?.addresses?.[0]?.latitude,
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "text",
      defaultValue: custData?.addresses?.[0]?.longitude,
    },
  ];

  const handleSubmit = async (formData: any) => {
    console.log("Form Data:", formData);
    console.log("Customer Data:", custData); // Gunakan custData di sini
  };

  return (
    <>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Master Customer", path: "/master_customer" },
          { title: "Detail Customer" },
        ]}
      />

      <div className="p-4">
        <div className="grid grid-cols-1">
          <CustomerForm fields={fields} onSubmit={handleSubmit} />
        </div>

        {/* Tombol Bawah */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-6 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50"
            onClick={() => navigate("/master_customer")}
          >
            Kembali
          </button>
          <button
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            onClick={() =>
              document
                .querySelector("form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                )
            }
          >
            Simpan
          </button>
        </div>
      </div>
    </>
  );
}

export default DetailCustomerPage;
