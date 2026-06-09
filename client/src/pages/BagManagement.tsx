import { useEffect, useState } from "react";
import {
  fetchBags,
  fetchPackages,
  createBag,
  addPackageToBag,
  updateBagStatus,
} from "../api/api";
import type { Bag, Package } from "../types";

const directions = ["north", "south", "east", "west", "central"];

const BagManagement = () => {
  const [bags, setBags] = useState<Bag[]>([]);
  const [unbagged, setUnbagged] = useState<Package[]>([]);
  const [direction, setDirection] = useState("north");
  const [regionId, setRegionId] = useState("1");
  const [selectedBag, setSelectedBag] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  const load = () => {
    fetchBags().then(setBags);
    fetchPackages().then((d) => setUnbagged(d.dashboard.unbagged));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateBag = async () => {
    await createBag({ region_id: parseInt(regionId), direction });
    load();
  };

  const handleAddPackage = async () => {
    if (!selectedBag || !selectedPackage) return;
    await addPackageToBag(parseInt(selectedBag), parseInt(selectedPackage));
    load();
  };

  const handleDelay = async (bagId: number) => {
    const reason = prompt("Enter delay reason:");
    if (!reason) return;
    await updateBagStatus(bagId, { status: "delayed", delay_reason: reason });
    load();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Bag Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Create New Bag */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="text-base font-semibold text-slate-700 mb-4">
            Create New Bag
          </h3>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-600">
              Direction
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {directions.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Region ID
              <input
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              onClick={handleCreateBag}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Create Bag
            </button>
          </div>
        </div>

        {/* Add Package to Bag */}
        <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
          <h3 className="text-base font-semibold text-slate-700 mb-4">
            Add Package to Bag
          </h3>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-600">
              Select Bag
              <select
                value={selectedBag}
                onChange={(e) => setSelectedBag(e.target.value)}
                className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- select bag --</option>
                {bags.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bag_code} ({b.direction})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              Select Package
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- select package --</option>
                {unbagged.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.tracking_id.slice(0, 8)}... — {p.sender_name}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handleAddPackage}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Bags Table */}
      <h2 className="text-base font-semibold text-slate-700 border-l-4 border-l-blue-400 pl-3 mb-3">
        All Bags{" "}
        <span className="text-slate-400 font-normal">({bags.length})</span>
      </h2>

      {bags.length === 0 ? (
        <p className="text-slate-400 text-sm">No bags created yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {["Bag Code", "Direction", "Status", "Packages", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bags.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{b.bag_code}</td>
                  <td className="px-4 py-3 capitalize">{b.direction}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === "delayed"
                          ? "bg-red-100 text-red-700"
                          : b.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{b.package_count}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelay(b.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md transition-colors"
                    >
                      Mark Delayed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BagManagement;
