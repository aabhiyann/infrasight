import { Link, Outlet } from "react-router-dom";
import "../layout.css";
const Layout = () => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <h1>InfraSight</h1>
        <ul>
          <li>
            <Link to="/overview">Overview</Link>
          </li>
          <li>
            <Link to="/forecast">Forecast</Link>
          </li>
          <li>
            <Link to="/anomalies">Anomalies</Link>
          </li>
          <li>
            <Link to="/recommendations">Recommendations</Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
