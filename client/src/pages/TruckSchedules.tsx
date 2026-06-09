import { useEffect, useState } from "react";
import {
  fetchTrucks,
  fetchSchedules,
  createSchedule,
  updateSchedule,
} from "../api/api";
import type { Truck, TruckSchedule } from "../types";

const TruckSchedules = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [schedules, setSchedules] = useState<TruckSchedule[]>([]);
  const [truckId, setTruckId] = useState("");
  const [regionId, setRegionId] = useState("1");
  const [departure, setDeparture] = useState("");

  const load = () => {
    fetchTrucks().then(setTrucks);
    fetchSchedules().then(setSchedules);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!truckId || !departure) return;
    await createSchedule({
      truck_id: parseInt(truckId),
      region_id: parseInt(regionId),
      scheduled_departure: departure,
    });
    load();
  };

  const handleDelay = async (scheduleId: number) => {
    const reason = prompt("Enter delay reason:");
    if (!reason) return;
    await updateSchedule(scheduleId, {
      status: "delayed",
      delay_reason: reason,
    });
    load();
  };

  const handleDepart = async (scheduleId: number) => {
    await updateSchedule(scheduleId, {
      status: "departed",
      actual_departure: new Date().toISOString(),
    });
    load();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Truck Schedules
      </h1>

      {/* Create Schedule Form */}
      <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm mb-8 max-w-md">
        <h3 className="text-base font-semibold text-slate-700 mb-4">
          Create Schedule
        </h3>
        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-600">
            Truck
            <select
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- select truck --</option>
              {trucks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.truck_code} (cap: {t.capacity})
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
          <label className="text-sm text-slate-600">
            Scheduled Departure
            <input
              type="datetime-local"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Create Schedule
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <h2 className="text-base font-semibold text-slate-700 border-l-4 border-l-blue-400 pl-3 mb-3">
        All Schedules{" "}
        <span className="text-slate-400 font-normal">({schedules.length})</span>
      </h2>

      {schedules.length === 0 ? (
        <p className="text-slate-400 text-sm">No schedules created yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {[
                  "Truck",
                  "Region",
                  "Scheduled",
                  "Status",
                  "Bags",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.truck_code}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                      {s.region_code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(s.scheduled_departure).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === "departed"
                          ? "bg-green-100 text-green-700"
                          : s.status === "delayed"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{s.bag_count}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleDelay(s.id)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1 rounded-md transition-colors"
                    >
                      Delay
                    </button>
                    <button
                      onClick={() => handleDepart(s.id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-md transition-colors"
                    >
                      Depart
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

export default TruckSchedules;
