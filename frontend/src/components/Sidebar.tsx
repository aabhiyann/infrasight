import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>InfraSight</h2>
      <nav>
        <NavLink
          to="/overview"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/forecast"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Forecast
        </NavLink>
        <NavLink
          to="/anomalies"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Anomalies
        </NavLink>
        <NavLink
          to="/recommendations"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Recommendations
        </NavLink>
        <NavLink
          to="/logs"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Logs
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
