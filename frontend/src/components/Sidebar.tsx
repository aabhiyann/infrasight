import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, Flex, Text, Stack } from "./ui";

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
      <Flex direction="column" justify="space-between" style={{ height: "100%" }}>
        <Box>
          <Flex align="center" gap="sm" mb="xl">
            <Box
              className="sidebar-logo"
              p="sm"
              style={{
                background: "var(--gradient-generic)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text fontSize="lg" fontWeight="bold" style={{ color: "white" }}>
                IS
              </Text>
            </Box>
            <Text as="h2" fontSize="lg" fontWeight="bold">
              InfraSight
            </Text>
          </Flex>
          <nav>
            <Stack spacing="xs">
              {[
                { to: "/overview", label: "Overview", icon: "📊" },
                { to: "/forecast", label: "Forecast", icon: "📈" },
                { to: "/anomalies", label: "Anomalies", icon: "⚠️" },
                { to: "/recommendations", label: "Recommendations", icon: "💡" },
                { to: "/logs", label: "Logs", icon: "📋" },
              ].map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <span className="sidebar-icon">{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </Stack>
          </nav>
        </Box>

        <Box>
          {/* User Info */}
          {user && (
            <Box
              mb="lg"
              p="md"
              className="sidebar-user-info"
            >
              <Flex align="center" gap="sm" mb="xs">
                <Box
                  className="sidebar-avatar"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--gradient-generic)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text fontSize="sm" fontWeight="bold" style={{ color: "white" }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb="none">
                    {user.username}
                  </Text>
                  <Text fontSize="xs" color="muted">
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
            <span className="sidebar-icon">🚪</span>
            <span>Logout</span>
          </button>

          <Text fontSize="xs" color="muted" mt="lg" className="text-center">
            © 2025 InfraSight
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;
