import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/bags", label: "Bag Management" },
  { to: "/trucks", label: "Truck Schedules" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="border-b bg-slate-900 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 className="text-xl font-bold">🚛 Courier Logistics</h1>
        <div className="flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm transition-colors hover:text-white ${
                pathname === to ? "pb-0.5 text-white" : "text-slate-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
