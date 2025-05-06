import React from "react";

const InfoTagihanTab = () => {
  const invoiceData = [
    {
      noFaktur: "INV-2025-001",
      tanggal: "24/04/2024 01:36",
      status: "Salesman",
      kuantitas: 100,
      hargaSatuan: "Rp 500.000",
      jumlah: "Rp 5.000.000",
    },
    // Tambahkan data lain di sini jika perlu
    {
      noFaktur: "INV-2025-001",
      tanggal: "24/04/2024 01:36",
      status: "Salesman",
      kuantitas: 100,
      hargaSatuan: "Rp 500.000",
      jumlah: "Rp 5.000.000",
    },
    {
      noFaktur: "INV-2025-001",
      tanggal: "24/04/2024 01:36",
      status: "Salesman",
      kuantitas: 100,
      hargaSatuan: "Rp 500.000",
      jumlah: "Rp 5.000.000",
    },
    {
      noFaktur: "INV-2025-001",
      tanggal: "24/04/2024 01:36",
      status: "Salesman",
      kuantitas: 100,
      hargaSatuan: "Rp 500.000",
      jumlah: "Rp 5.000.000",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Limit Kredit</label>
          <input
            type="text"
            placeholder="Limit Kredit"
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <label className="block mb-1 font-semibold">Sisa Limit Kredit</label>
          <input
            type="text"
            placeholder="Sisa Limit Kredit"
            className="w-full border rounded px-3 py-2 mb-4"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Outstanding AR</label>
          <input
            type="text"
            placeholder="Tertunda Pembayarannya"
            className="w-full border rounded px-3 py-2 mb-4"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">History Faktur</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">No. Faktur</th>
                <th className="px-3 py-2 border">Tanggal</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Kuantitas</th>
                <th className="px-3 py-2 border">Harga Satuan</th>
                <th className="px-3 py-2 border">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-3 py-2">{item.noFaktur}</td>
                  <td className="border px-3 py-2">{item.tanggal}</td>
                  <td className="border px-3 py-2">{item.status}</td>
                  <td className="border px-3 py-2">{item.kuantitas}</td>
                  <td className="border px-3 py-2">{item.hargaSatuan}</td>
                  <td className="border px-3 py-2">{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InfoTagihanTab;
