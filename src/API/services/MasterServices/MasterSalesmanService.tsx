// src/API/services/MasterServices/SalesmanService.ts
import axiosInstance from "../AxiosInstance";

/* ---------- type ---------- */
export interface Salesman {
  employee_id: any;
  salesrep_number: string; // Nomor sales representative
  salesrep_name: string | null; // Nama sales representative (bisa null)
  employee_name: string; // Nama karyawan
  supervisor_number: string | null; // Nomor supervisor (bisa null)
  salesrep_id: number; // ID sales representative
  sales_credit_type_id: number; // ID tipe kredit sales
  subinventory_code: string; // Kode subinventory
  locator_id: number; // ID locator
  vendor_name: string; // Nama vendor
  vendor_num: string; // Nomor vendor
  vendor_site_code: string; // Kode lokasi vendor
  vendor_id: number; // ID vendor
  vendor_site_id: number; // ID lokasi vendor
  organization_code: string; // Kode organisasi
  organization_name: string; // Nama organisasi
  organization_id: number; // ID organisasi
  org_name: string; // Nama organisasi (kode internal)
  org_id: string; // ID organisasi (string)
  status: string; // Status (contoh: "A")
  start_date_active: string; // Tanggal mulai aktif
  end_date_active: string | null; // Tanggal akhir aktif (bisa null)
}

export type SalesmanPayload = Omit<Salesman, "salesrep_id">; // contoh

/* ---------- helper ---------- */
const assert200 = (status: number, msg = "Request failed") => {
  if (status !== 200) throw new Error(msg);
};

/* ---------- queries ---------- */
export const fetchSalesman = async (): Promise<Salesman[]> => {
  const { data } = await axiosInstance.get(`/salesman/meta-find-all`);  
  assert200(data.statusCode, data.message);
  return data.data.data;
};

/* ---------- commands ---------- */
export const createSalesman = async (payload: SalesmanPayload) => {
  const { data } = await axiosInstance.post(`/salesman`, payload);
  assert200(data.statusCode, data.message);
  return data.data; // data salesman baru
};

export const updateSalesman = async (
  id: number,
  payload: Partial<SalesmanPayload>
) => {
  const { data } = await axiosInstance.put(`/salesman/${id}`, payload);
  assert200(data.statusCode, data.message);
  return data.data; // data salesman ter-update
};

export const deleteSalesman = async (id: number) => {
  const { data } = await axiosInstance.delete(`/salesman/${id}`);
  assert200(data.statusCode, data.message);
  return data.data; // data salesman ter-hapus
};
