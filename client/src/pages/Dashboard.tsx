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

const statusBadge: Record<string, string> = {
  to_be_picked_up: "bg-slate-100 text-slate-700",
  picked_up: "bg-purple-100 text-purple-700",
  added_to_bag: "bg-amber-100 text-amber-700",
  en_route: "bg-green-100 text-green-700",
  arrived: "bg-teal-100 text-teal-700",
  scheduled_for_delivery: "bg-cyan-100 text-cyan-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
};

const PackageTable = ({ packages }: { packages: Package[] }) =>
  packages.length === 0 ? (
    <p className="text-slate-400 text-sm py-2">No packages.</p>
  ) : (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {[
              "Tracking ID",
              "Sender",
              "Receiver",
              "Weight",
              "Region",
              "Status",
              "Delay",
            ].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {packages.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-slate-500">
                {p.tracking_id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3">{p.sender_name}</td>
              <td className="px-4 py-3">{p.receiver_name}</td>
              <td className="px-4 py-3">{p.weight} kg</td>
              <td className="px-4 py-3">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                  {p.region_code}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[p.status] || "bg-slate-100 text-slate-600"}`}
                >
                  {statusLabel[p.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-red-500 text-xs">
                {p.delay_reason || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

const sectionBorder: Record<string, string> = {
  amber: "border-l-amber-400",
  blue: "border-l-blue-400",
  red: "border-l-red-400",
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
  <div className="mb-8">
    <h2
      className={`text-base font-semibold text-slate-700 border-l-4 ${sectionBorder[color]} pl-3 mb-3`}
    >
      {title}{" "}
      <span className="text-slate-400 font-normal">({packages.length})</span>
    </h2>
    <PackageTable packages={packages} />
  </div>
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

  if (!dashboard)
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        Loading...
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Logistics Dashboard
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Back-office package and logistics management.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Unbagged Packages</p>
          <p className="text-3xl font-bold text-amber-500">
            {dashboard.unbagged.length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Bagged Packages</p>
          <p className="text-3xl font-bold text-blue-500">
            {dashboard.bagged.length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Delayed Packages</p>
          <p className="text-3xl font-bold text-red-500">
            {dashboard.delayed.length}
          </p>
        </div>
      </div>

      <Section
        title="📦 Unbagged Packages"
        packages={dashboard.unbagged}
        color="amber"
      />
      <Section
        title="🛍️ Bagged Packages"
        packages={dashboard.bagged}
        color="blue"
      />
      <Section
        title="⚠️ Delayed Packages"
        packages={dashboard.delayed}
        color="red"
      />
    </div>
  );
};

export default Dashboard;
