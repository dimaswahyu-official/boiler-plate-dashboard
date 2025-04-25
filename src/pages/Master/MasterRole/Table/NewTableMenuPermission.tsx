import { useMemo, useEffect, useState } from "react";
import { useMenuStore } from "../../../../API/store/menuStore";

export default function NewTableMenuPermission() {
  const { fetchMenus, menus } = useMenuStore();

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    console.log("Fetched menus:", menus);
  }, [menus]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Akses Menu</h3>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nama Menu</th>
            <th className="border border-gray-300 px-4 py-2">Create</th>
            <th className="border border-gray-300 px-4 py-2">Edit</th>
            <th className="border border-gray-300 px-4 py-2">View</th>
            <th className="border border-gray-300 px-4 py-2">Delete</th>
            <th className="border border-gray-300 px-4 py-2">Manage</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu: any, index: number) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{menu.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input type="checkbox" />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input type="checkbox" />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input type="checkbox" />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input type="checkbox" />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input type="checkbox" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
