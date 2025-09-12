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
      height="100vh"
      style={{
        width: 200,
        background: "var(--color-primary)",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Flex direction="column" justify="space-between" height="100%">
        <Box>
          <Text as="h2" fontSize="lg" fontWeight="bold" mb="lg" color="white">
            InfraSight
          </Text>
          <nav>
            <Stack spacing="xs">
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
            </Stack>
          </nav>
        </Box>

        <Box>
          {/* User Info */}
          {user && (
            <Box
              mb="lg"
              p="sm"
              className="sidebar-user-info"
            >
              <Text fontSize="sm" fontWeight="bold" color="white" mb="xs">
                {user.username}
              </Text>
              <Text fontSize="xs" color="white" style={{ opacity: 0.8 }}>
                {user.email}
              </Text>
            </Box>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="sidebar-logout-btn"
            style={{ width: "100%" }}
          >
            Logout
          </button>

          <Text fontSize="xs" color="white" mt="lg" style={{ opacity: 0.8 }}>
            © 2025 InfraSight
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;
