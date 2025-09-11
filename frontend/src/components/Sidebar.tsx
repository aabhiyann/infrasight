import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: 200,
        backgroundColor: "#1d3557",
        color: "#fff",
        padding: "1rem",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: "1.5rem" }}>InfraSight</h2>
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <NavLink
          to="/overview"
          style={({ isActive }) => ({
            color: isActive ? "#fca311" : "#fff",
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Overview
        </NavLink>
        <NavLink
          to="/forecast"
          style={({ isActive }) => ({
            color: isActive ? "#fca311" : "#fff",
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Forecast
        </NavLink>
        <NavLink
          to="/anomalies"
          style={({ isActive }) => ({
            color: isActive ? "#fca311" : "#fff",
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Anomalies
        </NavLink>
        <NavLink
          to="/recommendations"
          style={({ isActive }) => ({
            color: isActive ? "#fca311" : "#fff",
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Recommendations
        </NavLink>
        <NavLink
          to="/logs"
          style={({ isActive }) => ({
            color: isActive ? "#fca311" : "#fff",
            textDecoration: "none",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Logs
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
