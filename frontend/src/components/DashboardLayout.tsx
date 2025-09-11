import { Link, Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();

  const navItems = [
    { label: "Overview", path: "/overview" },
    { label: "Forecast", path: "/forecast" },
    { label: "Anomalies", path: "/anomalies" },
    { label: "Logs", path: "/logs" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "200px",
          background: "#1d3557",
          color: "#fff",
          padding: "1rem",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "1rem" }}>InfraSight</h2>
        <nav>
          {navItems.map((item) => (
            <div key={item.path} style={{ margin: "1rem 0" }}>
              <Link
                to={item.path}
                style={{
                  color: location.pathname === item.path ? "#fca311" : "#fff",
                  textDecoration: "none",
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                }}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
      </aside>

      {/* Page content */}
      <main style={{ flexGrow: 1, padding: "2rem", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
