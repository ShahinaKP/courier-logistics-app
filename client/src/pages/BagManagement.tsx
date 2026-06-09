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
    <div style={{ padding: "2rem" }}>
      <h1>Bag Management</h1>

      <div style={card}>
        <h3>Create New Bag</h3>
        <label>
          Direction:
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={input}
          >
            {directions.map((d) => (
              <option key={d} value={d}>
                {d}
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
        <button style={btn} onClick={handleCreateBag}>
          Create Bag
        </button>
      </div>

      <div style={card}>
        <h3>Add Package to Bag</h3>
        <label>
          Select Bag:
          <select
            style={input}
            value={selectedBag}
            onChange={(e) => setSelectedBag(e.target.value)}
          >
            <option value="">-- select bag --</option>
            {bags.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bag_code} ({b.direction})
              </option>
            ))}
          </select>
        </label>
        <label>
          Select Package:
          <select
            style={input}
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
          >
            <option value="">-- select package --</option>
            {unbagged.map((p) => (
              <option key={p.id} value={p.id}>
                {p.tracking_id.slice(0, 8)}... — {p.sender_name}
              </option>
            ))}
          </select>
        </label>
        <button style={btn} onClick={handleAddPackage}>
          Add to Bag
        </button>
      </div>

      <h2>All Bags</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={th}>Bag Code</th>
            <th style={th}>Direction</th>
            <th style={th}>Status</th>
            <th style={th}>Packages</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bags.map((b) => (
            <tr key={b.id}>
              <td style={td}>{b.bag_code}</td>
              <td style={td}>{b.direction}</td>
              <td style={td}>{b.status}</td>
              <td style={td}>{b.package_count}</td>
              <td style={td}>
                <button
                  onClick={() => handleDelay(b.id)}
                  style={{
                    ...btn,
                    backgroundColor: "#ef4444",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.8rem",
                  }}
                >
                  Mark Delayed
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

export default BagManagement;
