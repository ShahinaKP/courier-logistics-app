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
    <div style={{ padding: "2rem" }}>
      <h1>Truck Schedules</h1>

      <div style={card}>
        <h3>Create Schedule</h3>
        <label>
          Truck:
          <select
            style={input}
            value={truckId}
            onChange={(e) => setTruckId(e.target.value)}
          >
            <option value="">-- select truck --</option>
            {trucks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.truck_code} (cap: {t.capacity})
              </option>
            ))}
          </select>
        </label>
        <label>
          Region ID:
          <input
            style={input}
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
          />
        </label>
        <label>
          Scheduled Departure:
          <input
            type="datetime-local"
            style={input}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
        </label>
        <button style={btn} onClick={handleCreate}>
          Create Schedule
        </button>
      </div>

      <h2>All Schedules</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={th}>Truck</th>
            <th style={th}>Region</th>
            <th style={th}>Scheduled</th>
            <th style={th}>Status</th>
            <th style={th}>Bags</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td style={td}>{s.truck_code}</td>
              <td style={td}>{s.region_code}</td>
              <td style={td}>
                {new Date(s.scheduled_departure).toLocaleString()}
              </td>
              <td style={td}>{s.status}</td>
              <td style={td}>{s.bag_count}</td>
              <td style={td}>
                <button
                  onClick={() => handleDelay(s.id)}
                  style={{
                    ...btn,
                    backgroundColor: "#f59e0b",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                    marginRight: "0.5rem",
                  }}
                >
                  Delay
                </button>
                <button
                  onClick={() => handleDepart(s.id)}
                  style={{
                    ...btn,
                    backgroundColor: "#22c55e",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                  }}
                >
                  Depart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const card: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  maxWidth: "500px",
};
const input: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.4rem",
  marginTop: "0.25rem",
  borderRadius: "4px",
  border: "1px solid #cbd5e1",
};
const btn: React.CSSProperties = {
  padding: "0.5rem 1rem",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const th: React.CSSProperties = {
  padding: "0.5rem",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
};
const td: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #f1f5f9",
};

export default TruckSchedules;
