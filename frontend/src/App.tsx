import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/Overview";
import Forecast from "./pages/Forecast";
import Anomalies from "./pages/Anomalies";
import Logs from "./pages/Logs";
import Recommendations from "./pages/Recommendations";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="forecast" element={<Forecast />} />
        <Route path="anomalies" element={<Anomalies />} />
        <Route path="logs" element={<Logs />} />
        <Route path="recommendations" element={<Recommendations />} />
      </Route>
    </Routes>
  );
};

export default App;
