import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaChevronDown,
  FaChevronRight,
  FaMapPin,
  FaBan,
  FaCheck,
} from "react-icons/fa";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Spinner from "../../../components/ui/spinner";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { showSuccessToast } from "../../../components/toast";
import { useDebounce } from "../../../helper/useDebounce";
import { usePagePermissions } from "../../../utils/UserPermission/UserPagePermissions";

/* ─── TYPE ──────────────────────────────────────────────────────── */
type KelurahanT = {
  id: number;
  kelurahan_code: string;
  kelurahan: string;
  exist: boolean; // false → milik cabang/region ini
  disabled: boolean; // true  → dipakai cabang lain
};

/* ─── COMPONENT ─────────────────────────────────────────────────── */
const SelectTerritory = () => {
  /* route params */
  const { state } = useLocation();
  const navigate = useNavigate();
  const { canCreate, canManage } = usePagePermissions();

  const branchId = state?.id;
  const regionCode = state?.region_code;
  const organizationCode = state?.organization_code;
  const organizationName = state?.organization_name;

  /* state */
  const [geoTrees, setGeoTrees] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [isLoading, setIsLoading] = useState(true);

  /* ─── FETCH TREE + PRE-CHECK ──────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const URL = `http://10.0.29.47/api/v1/geotree/get-mapped-tree?branch_id=${branchId}`;
        console.log("Fetching geotree from:", URL);

        const { data } = await axios.get(URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const trees = Array.isArray(data.data) ? data.data : [];
        setGeoTrees(trees);

        /* preset-checked: kelurahan milik cabang ini (exist === false, tidak disabled) */
        const pre: number[] = [];
        trees.forEach((prov: { kotamadya: any[] }) =>
          prov.kotamadya.forEach((kota: any) =>
            kota.kecamatan.forEach((kec: any) =>
              kec.kelurahan.forEach((kel: KelurahanT) => {
                if (!kel.disabled && kel.exist === false) pre.push(kel.id);
              })
            )
          )
        );
        setCheckedIds(pre);
      } catch (err) {
        console.error("Error fetching geotree:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [branchId, regionCode]);

  /* ─── HELPERS ─────────────────────────────────────────────────── */
  const isDisabled = (kel: KelurahanT) => kel.disabled;
  const isChecked = (kel: KelurahanT) =>
    kel.disabled || checkedIds.includes(kel.id);

  /* id kelurahan yg masih bisa dipilih */
  const selectableIds = (list: KelurahanT[]) =>
    list.filter((k) => !k.disabled).map((k) => k.id);

  /* true jika SEMUA yang selectable sudah dicentang
     Catatan: [].every() => true (berarti seluruh kelurahan di sana disabled) */
  const areAllSelectableChecked = (list: KelurahanT[]) =>
    selectableIds(list).every((id) => checkedIds.includes(id));

  /* toggle satu kelurahan */
  const toggleKelurahan = (kel: KelurahanT) => {
    if (kel.disabled) return;
    setCheckedIds((prev) =>
      prev.includes(kel.id)
        ? prev.filter((id) => id !== kel.id)
        : [...prev, kel.id]
    );
  };

  /* toggle kecamatan */
  const handleKecamatanToggle = (kelList: KelurahanT[]) => {
    const ids = selectableIds(kelList);
    const all = ids.every((id) => checkedIds.includes(id));
    setCheckedIds((prev) =>
      all
        ? prev.filter((id) => !ids.includes(id))
        : [...prev, ...ids.filter((id) => !prev.includes(id))]
    );
  };

  /* toggle kotamadya */
  const handleKotamadyaToggle = (kecamatan: any[]) => {
    const ids = selectableIds(kecamatan.flatMap((kec: any) => kec.kelurahan));
    const all = ids.every((id) => checkedIds.includes(id));
    setCheckedIds((prev) =>
      all
        ? prev.filter((id) => !ids.includes(id))
        : [...prev, ...ids.filter((id) => !prev.includes(id))]
    );
  };

  /* reset */
  const handleUncheckAll = () => setCheckedIds([]);

  const handleSubmit = async () => {
    const payload = {
      geotree_id: checkedIds,
      is_active: true,
      created_by: "admin",
    };

    console.log("Submitting payload:", payload);

    try {
      const token = localStorage.getItem("token");
      const URL = `http://10.0.29.47:9003/api/v1/territory?branch_id=${branchId}`;
      const res = await axios.post(URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.statusCode === 200) {
        showSuccessToast("Data berhasil disimpan.");
        setCheckedIds([]); // Reset checked IDs after successful save
        setGeoTrees([]); // Clear geoTrees after successful save

        navigate("/management_territory");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    }
  };

  /* filter provinsi */
  const filteredGeoTrees = geoTrees.filter((prov) =>
    prov.provinsi.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  /* ─── UI ───────────────────────────────────────────────────────── */
  return (
    <>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Management Territory", path: "/management_territory" },
          { title: `Branch` },
        ]}
      />

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="p-4 bg-white shadow rounded-md mb-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative group">
                  <Label htmlFor="search">Pencarian Provinsi</Label>
                  <Input
                    id="search"
                    placeholder="🔍 Masukan Provinsi"
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  />
                </div>

                <div className="space-x-4">
                  <p>
                    {organizationCode} - {organizationName}
                  </p>
                </div>

                <div className="space-x-4">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleUncheckAll}
                  >
                    <FaBan /> Batalkan Pilihan
                  </Button>

                  {canCreate && canManage && (
                    <Button size="sm" variant="primary" onClick={handleSubmit}>
                      <FaCheck /> Simpan
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tree */}
            {filteredGeoTrees.map((prov) => (
              <div key={prov.provinsi_code} className="ml-2">
                {/* provinsi */}
                <div
                  className="flex items-center gap-2 cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-600"
                  onClick={() =>
                    setExpanded((p) => ({
                      ...p,
                      [prov.provinsi_code]: !p[prov.provinsi_code],
                    }))
                  }
                >
                  {expanded[prov.provinsi_code] ? (
                    <FaChevronDown size={14} />
                  ) : (
                    <FaChevronRight size={14} />
                  )}
                  {prov.provinsi}
                </div>

                {expanded[prov.provinsi_code] &&
                  prov.kotamadya.map((kota: any) => {
                    const kotaSelectable = selectableIds(
                      kota.kecamatan.flatMap((kec: any) => kec.kelurahan)
                    );
                    const kotaAllChecked = kotaSelectable.every((id) =>
                      checkedIds.includes(id)
                    );

                    return (
                      <div key={kota.kotamadya_code} className="ml-5 mt-1">
                        {/* kotamadya */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="accent-orange-500 w-4 h-4"
                            checked={kotaAllChecked}
                            onChange={() =>
                              handleKotamadyaToggle(kota.kecamatan)
                            }
                          />
                          <div
                            className="flex items-center gap-2 cursor-pointer text-base font-medium text-gray-700 hover:text-blue-600"
                            onClick={() =>
                              setExpanded((p) => ({
                                ...p,
                                [kota.kotamadya_code]: !p[kota.kotamadya_code],
                              }))
                            }
                          >
                            {expanded[kota.kotamadya_code] ? (
                              <FaChevronDown size={12} />
                            ) : (
                              <FaChevronRight size={12} />
                            )}
                            {kota.kotamadya}
                          </div>
                        </div>

                        {/* kecamatan */}
                        {expanded[kota.kotamadya_code] &&
                          kota.kecamatan.map((kec: any) => {
                            const kelList: KelurahanT[] = kec.kelurahan;
                            const kecAllChecked =
                              areAllSelectableChecked(kelList);

                            return (
                              <div
                                key={kec.kecamatan_code}
                                className="ml-6 mt-1"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="accent-orange-500 w-4 h-4"
                                    checked={kecAllChecked}
                                    onChange={() =>
                                      handleKecamatanToggle(kelList)
                                    }
                                  />
                                  <div
                                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600"
                                    onClick={() =>
                                      setExpanded((p) => ({
                                        ...p,
                                        [kec.kecamatan_code]:
                                          !p[kec.kecamatan_code],
                                      }))
                                    }
                                  >
                                    {expanded[kec.kecamatan_code] ? (
                                      <FaChevronDown size={10} />
                                    ) : (
                                      <FaChevronRight size={10} />
                                    )}
                                    {kec.kecamatan}
                                  </div>
                                </div>

                                {/* kelurahan */}
                                {expanded[kec.kecamatan_code] &&
                                  kelList.map((kel) => (
                                    <div
                                      key={kel.kelurahan_code}
                                      className="ml-7 mt-1 flex items-center gap-2 text-sm"
                                    >
                                      <input
                                        type="checkbox"
                                        disabled={kel.disabled}
                                        className="accent-orange-500 w-4 h-4"
                                        checked={isChecked(kel)}
                                        onChange={() => toggleKelurahan(kel)}
                                      />
                                      <FaMapPin
                                        size={12}
                                        className="text-blue-600"
                                      />
                                      <span
                                        className={
                                          kel.disabled
                                            ? "text-gray-400 italic"
                                            : "text-gray-600"
                                        }
                                      >
                                        {kel.kelurahan}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default SelectTerritory;
