import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar = ({ isOpen = true }: SidebarProps) => {
  return (
    <div
      style={{
        width: 200,
        background: "var(--color-primary)",
        color: "#fff",
        padding: "1rem",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        zIndex: 1000,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
      className="sidebar"
    >
      <div>
        <h2 style={{ fontSize: 20, marginBottom: "1.5rem" }}>InfraSight</h2>
        <nav
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          {[
            { to: "/overview", label: "Overview" },
            { to: "/forecast", label: "Forecast" },
            { to: "/anomalies", label: "Anomalies" },
            { to: "/recommendations", label: "Recommendations" },
            { to: "/logs", label: "Logs" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <p style={{ fontSize: "0.8rem", marginTop: "auto" }}>© 2025 InfraSight</p>
    </div>
  );
};

export default Sidebar;
