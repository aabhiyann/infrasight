import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayout from "./layout/DashboardLayout";
import Overview from "./pages/Overview";
import Forecast from "./pages/Forecast";
import Anomalies from "./pages/Anomalies";
import Logs from "./pages/Logs";
import Recommendations from "./pages/Recommendations";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="anomalies" element={<Anomalies />} />
          <Route path="logs" element={<Logs />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
