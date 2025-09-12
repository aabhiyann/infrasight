import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, Flex, Text, Stack } from "./ui";
import {
  OverviewIcon,
  ForecastIcon,
  AnomalyIcon,
  RecommendationIcon,
  LogsIcon,
  LogoutIcon,
  InfraSightLogo,
} from "./ui/Icons";
import "./Sidebar.css";

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
    <Box
      className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}
      p="lg"
      style={{
        width: 240,
        height: "100vh",
        background: "var(--color-surface)",
        color: "var(--color-text)",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      <Flex
        direction="column"
        justify="space-between"
        style={{ height: "100%" }}
      >
        <Box>
          <Flex align="center" gap="md" mb="xl">
            <InfraSightLogo size={32} />
            <Text as="h2" fontSize="lg" fontWeight="bold">
              InfraSight
            </Text>
          </Flex>
          <nav>
            <Stack spacing="xs">
              {[
                { to: "/overview", label: "Overview", icon: OverviewIcon },
                { to: "/forecast", label: "Forecast", icon: ForecastIcon },
                { to: "/anomalies", label: "Anomalies", icon: AnomalyIcon },
                {
                  to: "/recommendations",
                  label: "Recommendations",
                  icon: RecommendationIcon,
                },
                { to: "/logs", label: "Logs", icon: LogsIcon },
              ].map(({ to, label, icon: IconComponent }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <IconComponent size={20} className="sidebar-icon" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </Stack>
          </nav>
        </Box>

        <Box>
          {/* User Info */}
          {user && (
            <Box mb="lg" p="md" className="sidebar-user-info">
              <Flex align="center" gap="sm" mb="none">
                <Box className="sidebar-avatar">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    style={{ color: "white" }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Text>
                </Box>
                <Box className="sidebar-user-text">
                  <Text fontSize="sm" fontWeight="semibold" mb="none">
                    {user.username}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="muted"
                    className="sidebar-user-email"
                  >
                    {user.email}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="sidebar-logout-btn"
            style={{ width: "100%" }}
          >
            <LogoutIcon size={20} className="sidebar-icon" />
            <span>Logout</span>
          </button>

          <Text fontSize="xs" color="muted" mt="xl" className="text-center">
            © 2025 InfraSight
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;
