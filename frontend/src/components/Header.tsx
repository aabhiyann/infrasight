import { Box, Flex, Text } from "./ui";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({ title, onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [elevated, setElevated] = useState(false);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
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
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
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
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        padding: "10px 16px",
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
          <div>
            <Text as="h1" fontSize="lg" fontWeight="semibold" mb="xs">
              {activeTitle}
            </Text>
            <Breadcrumb items={[{ label: activeTitle }]} />
          </div>
        </Flex>
        <Flex align="center" gap="md">
          <ThemeToggle />
          {/* Desktop user dropdown; hide on small screens via CSS if desired */}
          {user ? (
            <div className="header-user" ref={menuRef}>
              <button
                className="header-user-trigger"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <div className="header-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>
              {menuOpen && (
                <div className="header-user-menu" role="menu">
                  <div className="header-user-meta">
                    <div className="name">{user.username}</div>
                    <div className="email">{user.email}</div>
                  </div>
                  <button className="header-menu-item" role="menuitem">
                    Settings
                  </button>
                  <button
                    className="header-menu-item danger"
                    role="menuitem"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
