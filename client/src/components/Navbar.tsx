import { Link } from "react-router-dom";

const Navbar = () => (
  <nav
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#0f172a",
      color: "white",
    }}
  >
    <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
      🚛 Courier Logistics
    </span>
    <div style={{ display: "flex", gap: "1.5rem" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Dashboard
      </Link>
      <Link to="/bags" style={{ color: "white", textDecoration: "none" }}>
        Bag Management
      </Link>
      <Link to="/trucks" style={{ color: "white", textDecoration: "none" }}>
        Truck Schedules
      </Link>
    </div>
  </nav>
);

export default Navbar;
