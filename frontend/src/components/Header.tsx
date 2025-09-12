import { Box, Flex } from "./ui";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";

interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({ title, onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [elevated, setElevated] = useState(false);
  const location = useLocation();

  const routeTitleMap: Record<string, string> = {
    "/overview": "Overview",
    "/forecast": "Forecast",
    "/anomalies": "Anomalies",
    "/recommendations": "Recommendations",
    "/logs": "Logs",
  };

  const activeTitle = useMemo(() => {
    if (title) return title;
    const path = location.pathname;
    return routeTitleMap[path] || "Dashboard";
  }, [location.pathname, title]);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 2);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Box
      as="header"
      className={`app-header ${elevated ? "is-elevated" : ""}`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 900,
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        padding: "8px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        // Make header span full width within padded main container
        marginLeft: "-2rem",
        marginRight: "-2rem",
      }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap="md">
          <button
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
            onClick={onToggleSidebar}
            className={`hamburger ${isSidebarOpen ? "is-open" : ""}`}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="sr-only">Menu</span>
          </button>
          <Breadcrumb items={[
            { label: "Dashboard", href: "/overview" },
            { label: activeTitle }
          ]} />
        </Flex>
        <Flex align="center" gap="md">
          <ThemeToggle />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
