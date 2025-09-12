import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar = ({ isOpen = true }: SidebarProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

      <div>
        {/* User Info */}
        {user && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "4px",
              fontSize: "0.9rem",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{user.username}</div>
            <div style={{ opacity: 0.8, fontSize: "0.8rem" }}>{user.email}</div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          }}
        >
          Logout
        </button>

        <p style={{ fontSize: "0.8rem", marginTop: "auto" }}>
          © 2025 InfraSight
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
