import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import axios from "axios";
import Spinner from "../../../components/ui/spinner";

export default function ManagementTerritory() {
  const [selectedRegion, setSelectedRegion] = useState("Regional Jakarta 1");
  const [regions, setRegions] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State untuk menyimpan branches

  const navigate = useNavigate();

  const handleSelectBranch = (branch: any) => {
    console.log("Selected branch:", branch);
    const { id, region_code, organization_code, organization_name } = branch;

    // Navigasi ke halaman berikutnya dengan state
    navigate("/select_territory", {
      state: { id, region_code, organization_code, organization_name },
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://10.0.29.47/api/v1/region/with-branch",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedRegions = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setIsLoading(false);
      setRegions(fetchedRegions);

      // Tambahkan region_code ke setiap branch
      const initialRegion = fetchedRegions.find(
        (region: { region_name: string }) =>
          region.region_name === selectedRegion
      );

      const branchesWithRegionCode = initialRegion?.branches.map(
        (branch: any) => ({
          ...branch,
          region_code: initialRegion.region_code, // Tambahkan region_code
        })
      );

      setBranches(branchesWithRegionCode || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update branches setiap kali selectedRegion berubah
    const selectedRegionData = regions.find(
      (region) => region.region_name === selectedRegion
    );
    setBranches(selectedRegionData?.branches || []);
  }, [selectedRegion, regions]);

  return (
    <>
      <PageBreadcrumb breadcrumbs={[{ title: "Management Territory" }]} />

      {isLoading ? ( // Tampilkan spinner jika isLoading true
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 p-6">
          {/* Search Box */}
          <div className="bg-white rounded shadow p-4 mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Pencarian Region
            </label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search Region..."
                className="w-full border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring focus:border-orange-400 text-sm"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-r hover:bg-orange-600">
                🔍
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded shadow p-4 flex gap-4">
            {/* Region List */}
            <div className="w-1/3 border-r pr-4">
              <h2 className="font-semibold text-gray-800 mb-2">Region List</h2>
              <ul className="space-y-2">
                {regions.map((region: any, index: number) => (
                  <li key={index}>
                    <button
                      className={`w-full text-left px-4 py-2 rounded ${
                        selectedRegion === region.region_name
                          ? "bg-orange-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedRegion(region.region_name)}
                    >
                      {region.region_name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Branch List */}
            <div className="w-2/3">
              <h2 className="font-semibold text-gray-800 mb-1">Branch List</h2>
              <p className="text-sm text-orange-500 mb-4">
                <em>Pilih lokasi cabang yang ingin Anda akses</em>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-orange-50 p-4 rounded-xl shadow-inner">
                {branches.map((branch: any) => (
                  <button
                    key={branch.organization_code}
                    onClick={() => handleSelectBranch(branch)} // Kirim region_code
                    className="flex flex-col items-center justify-center border-2 border-orange-300 rounded-lg p-4 hover:shadow-lg hover:bg-orange-300 transition-transform transform hover:scale-105 w-full"
                  >
                    <div className="text-4xl mb-2">🏠</div>
                    <div className="text-lg font-bold">
                      {branch.organization_code}
                    </div>
                    <div className="text-sm text-gray-600">
                      {branch.organization_name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
