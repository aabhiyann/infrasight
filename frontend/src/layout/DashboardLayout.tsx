import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 200, padding: "2rem", width: "100%" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
