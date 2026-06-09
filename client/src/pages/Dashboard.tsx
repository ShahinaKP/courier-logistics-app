import { useEffect, useState } from "react";
import { fetchPackages } from "../api/api";
import type { Package } from "../types";

const statusLabel: Record<string, string> = {
  to_be_picked_up: "To Be Picked Up",
  picked_up: "Picked Up",
  added_to_bag: "Added to Bag",
  en_route: "En Route",
  arrived: "Arrived",
  scheduled_for_delivery: "Scheduled for Delivery",
  out_for_delivery: "Out for Delivery",
};

const PackageTable = ({ packages }: { packages: Package[] }) =>
  packages.length === 0 ? (
    <p style={{ color: "#888" }}>No packages.</p>
  ) : (
    <table
      style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}
    >
      <thead>
        <tr style={{ backgroundColor: "#f1f5f9" }}>
          <th style={th}>Tracking ID</th>
          <th style={th}>Sender</th>
          <th style={th}>Receiver</th>
          <th style={th}>Weight</th>
          <th style={th}>Region</th>
          <th style={th}>Status</th>
          <th style={th}>Delay</th>
        </tr>
      </thead>
      <tbody>
        {packages.map((p) => (
          <tr key={p.id}>
            <td style={td}>{p.tracking_id.slice(0, 8)}...</td>
            <td style={td}>{p.sender_name}</td>
            <td style={td}>{p.receiver_name}</td>
            <td style={td}>{p.weight} kg</td>
            <td style={td}>{p.region_code}</td>
            <td style={td}>{statusLabel[p.status]}</td>
            <td style={td}>{p.delay_reason || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<{
    unbagged: Package[];
    bagged: Package[];
    delayed: Package[];
  } | null>(null);

  useEffect(() => {
    fetchPackages().then((data) => setDashboard(data.dashboard));
  }, []);

  if (!dashboard) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Logistics Dashboard</h1>
      <Section
        title="📦 Unbagged Packages"
        packages={dashboard.unbagged}
        color="#f59e0b"
      />
      <Section
        title="🛍️ Bagged Packages"
        packages={dashboard.bagged}
        color="#3b82f6"
      />
      <Section
        title="⚠️ Delayed Packages"
        packages={dashboard.delayed}
        color="#ef4444"
      />
    </div>
  );
};

const Section = ({
  title,
  packages,
  color,
}: {
  title: string;
  packages: Package[];
  color: string;
}) => (
  <div style={{ marginBottom: "2rem" }}>
    <h2 style={{ borderLeft: `4px solid ${color}`, paddingLeft: "0.75rem" }}>
      {title}{" "}
      <span style={{ fontSize: "0.9rem", color: "#666" }}>
        ({packages.length})
      </span>
    </h2>
    <PackageTable packages={packages} />
  </div>
);

const th: React.CSSProperties = {
  padding: "0.5rem",
  textAlign: "left",
  borderBottom: "1px solid #e2e8f0",
};
const td: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid #f1f5f9",
};

export default Dashboard;
