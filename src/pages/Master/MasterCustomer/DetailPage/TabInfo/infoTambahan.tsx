import React, { useState } from "react";

const InfoTambahanTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Column */}
      <div>
        <label className="block mb-1 font-semibold">Channel Pelanggan</label>
        <select className="w-full border rounded px-3 py-2 mb-4">
          <option>Channel</option>
        </select>

        <label className="block mb-1 font-semibold">Cabang Pelanggan</label>
        <select className="w-full border rounded px-3 py-2 mb-4">
          <option>Branch</option>
        </select>

        <label className="block mb-1 font-semibold">ID Organisasi</label>
        <input
          type="text"
          placeholder="ID Organisasi"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 font-semibold">Aktif</label>
        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <span className="italic text-sm">Aktifkan akun pengguna ini</span>
        </div>
      </div>

      {/* Right Column */}
      <div>
        <label className="block mb-1 font-semibold">Cycle</label>
        <select className="w-full border rounded px-3 py-2 mb-4">
          <option>Cycle</option>
        </select>

        <label className="block mb-1 font-semibold">Call Cycle</label>
        <input
          type="text"
          placeholder="Call Cycle"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-1 font-semibold">Hari Kunjungan</label>
        <input type="date" className="w-full border rounded px-3 py-2 mb-4" />
      </div>
    </div>
  );
};

export default InfoTambahanTab;
