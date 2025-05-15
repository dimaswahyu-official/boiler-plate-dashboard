import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronRight, FaMapPin } from "react-icons/fa";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import Spinner from "../../../components/ui/spinner";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";

const SelectTerritory = () => {
  const [geoTrees, setGeoTrees] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Tambahkan state isLoading

  const provinsiRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set isLoading ke true sebelum memulai fetch
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://10.0.29.47/api/v1/geotree/get-mapped-tree",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const trees = Array.isArray(res.data.data.geoTrees)
          ? res.data.data.geoTrees
          : [];
        setGeoTrees(trees);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set isLoading ke false setelah fetch selesai
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCheck = (code: string) => {
    setChecked((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
    );
  };

  const isKelurahanChecked = (code: string) => checked.includes(code);

  const areAllKelurahanChecked = (kelurahan: any[]) =>
    kelurahan.every((k: any) => checked.includes(k.kelurahan_code));

  const areSomeKelurahanChecked = (kelurahan: any[]) =>
    kelurahan.some((k: any) => checked.includes(k.kelurahan_code));

  const handleKecamatanToggle = (kelurahan: any[]) => {
    const allChecked = areAllKelurahanChecked(kelurahan);
    const kelCodes = kelurahan.map((k: any) => k.kelurahan_code);
    setChecked((prev) =>
      allChecked
        ? prev.filter((code) => !kelCodes.includes(code))
        : [...prev, ...kelCodes.filter((code) => !prev.includes(code))]
    );
  };

  const handleKotamadyaToggle = (kecamatan: any[]) => {
    let allKelurahan: string[] = [];
    kecamatan.forEach((kec: any) => {
      allKelurahan.push(...kec.kelurahan.map((k: any) => k.kelurahan_code));
    });
    const allChecked = allKelurahan.every((code) => checked.includes(code));
    setChecked((prev) =>
      allChecked
        ? prev.filter((code) => !allKelurahan.includes(code))
        : [...prev, ...allKelurahan.filter((code) => !prev.includes(code))]
    );
  };

  const filteredGeoTrees = geoTrees.filter((provinsi) =>
    provinsi.provinsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageBreadcrumb
        breadcrumbs={[
          { title: "Management Territory", path: "/management_territory" },
          { title: "Wilayah" },
        ]}
      />

      <div className="p-4 bg-white shadow rounded-md mb-5">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Label htmlFor="">Pencarian</Label>
            <Input
              onChange={(e) => setSearchQuery(e.target.value)} // Pastikan ini menerima string secara langsung
              type="text"
              id="search"
              placeholder="🔍 Cari Provinsi..."
            />
          </div>

          <div className="space-x-4">
            <Button variant="primary" size="sm">
              Batalkan Pilihan
            </Button>

            <Button variant="primary" size="sm">
              Simpan
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 ">
        {isLoading ? ( // Tampilkan spinner jika isLoading true
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          filteredGeoTrees.map((provinsi) => (
            <div key={provinsi.provinsi_code} className="ml-2">
              <div
                onClick={() => toggleExpand(provinsi.provinsi_code)}
                className="flex items-center gap-2 cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
              >
                {expanded[provinsi.provinsi_code] ? (
                  <FaChevronDown size={14} />
                ) : (
                  <FaChevronRight size={14} />
                )}
                {provinsi.provinsi}
              </div>

              {expanded[provinsi.provinsi_code] &&
                provinsi.kotamadya.map((kota: any) => {
                  const kotKelurahan = kota.kecamatan.flatMap((k: any) =>
                    k.kelurahan.map((kel: any) => kel.kelurahan_code)
                  );
                  const isKotaChecked = kotKelurahan.every((code: string) =>
                    checked.includes(code)
                  );

                  return (
                    <div key={kota.kotamadya_code} className="ml-5 mt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          ref={(el) => {
                            provinsiRefs.current[kota.kotamadya_code] = el;
                          }}
                          checked={isKotaChecked}
                          onChange={() => handleKotamadyaToggle(kota.kecamatan)}
                          className="accent-orange-500 w-4 h-4"
                        />
                        <div
                          onClick={() => toggleExpand(kota.kotamadya_code)}
                          className="flex items-center gap-2 cursor-pointer text-base font-medium text-gray-700 hover:text-blue-600 transition"
                        >
                          {expanded[kota.kotamadya_code] ? (
                            <FaChevronDown size={12} />
                          ) : (
                            <FaChevronRight size={12} />
                          )}
                          {kota.kotamadya}
                        </div>
                      </div>

                      {expanded[kota.kotamadya_code] &&
                        kota.kecamatan.map((kec: any) => {
                          const kelurahan = kec.kelurahan;
                          const isKecamatanChecked =
                            areAllKelurahanChecked(kelurahan);

                          return (
                            <div key={kec.kecamatan_code} className="ml-6 mt-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  ref={(el) => {
                                    provinsiRefs.current[kec.kecamatan_code] =
                                      el;
                                  }}
                                  checked={isKecamatanChecked}
                                  onChange={() =>
                                    handleKecamatanToggle(kelurahan)
                                  }
                                  className="accent-orange-500 w-4 h-4"
                                />
                                <div
                                  onClick={() =>
                                    toggleExpand(kec.kecamatan_code)
                                  }
                                  className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600 transition"
                                >
                                  {expanded[kec.kecamatan_code] ? (
                                    <FaChevronDown size={10} />
                                  ) : (
                                    <FaChevronRight size={10} />
                                  )}
                                  {kec.kecamatan}
                                </div>
                              </div>

                              {expanded[kec.kecamatan_code] &&
                                kelurahan.map((kel: any) => (
                                  <div
                                    key={kel.kelurahan_code}
                                    className="ml-7 mt-1 flex items-center gap-2 text-sm text-gray-600"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isKelurahanChecked(
                                        kel.kelurahan_code
                                      )}
                                      onChange={() =>
                                        toggleCheck(kel.kelurahan_code)
                                      }
                                      className="accent-orange-500 w-4 h-4"
                                    />
                                    <FaMapPin
                                      size={12}
                                      className="text-blue-600"
                                    />
                                    <span>{kel.kelurahan}</span>
                                  </div>
                                ))}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SelectTerritory;
