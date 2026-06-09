import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/bags", label: "Bag Management" },
  { to: "/trucks", label: "Truck Schedules" },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between shadow-md">
      <span className="text-lg font-bold tracking-tight">
        🚛 Courier Logistics
      </span>
      <div className="flex gap-6">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`text-sm font-medium transition-colors hover:text-white ${
              pathname === to
                ? "text-white border-b-2 border-blue-400 pb-0.5"
                : "text-slate-400"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
