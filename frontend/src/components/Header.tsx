import { Box, Flex } from "./ui";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import UserMenu from "./UserMenu";

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

  const breadcrumbItems = useMemo(() => {
    const items = [];
    if (location.pathname !== "/overview") {
      items.push({ label: "Dashboard", href: "/overview" });
    }
    items.push({ label: activeTitle });
    return items;
  }, [location.pathname, activeTitle]);

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
        padding: `clamp(8px, 2.4vw, var(--header-padding-y)) clamp(12px, 4vw, var(--header-padding-x))`,
        boxShadow: elevated ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        // Make header span full width within padded main container while remaining reasonable on mobile
        marginLeft: `clamp(-1rem, -4vw, calc(-1 * var(--header-margin-x)))`,
        marginRight: `clamp(-1rem, -4vw, calc(-1 * var(--header-margin-x)))`,
        marginTop: `clamp(-1rem, -4vw, calc(-1 * var(--header-margin-top)))`,
        marginBottom: "1rem",
      }}
    >
      <Flex align="center" justify="space-between" style={{ width: "100%" }}>
        <Flex align="center" gap="lg">
          <button
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
            onClick={onToggleSidebar}
            className={`hamburger ${isSidebarOpen ? "is-open" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="sr-only">Menu</span>
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </Flex>
        <Flex align="center" gap="md" style={{ flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ThemeToggle />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserMenu variant="header" />
          </div>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
