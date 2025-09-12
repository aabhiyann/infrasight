import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { useEffect, useState } from "react";
import { Box, Flex, Text } from "../components/ui";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Box display="flex">
      <Sidebar isOpen={isOpen} />
      {/* Mobile overlay */}
      {isOpen && isMobile ? (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      ) : null}
      <Box
        as="main"
        p="2xl"
        width="full"
        className="dashboard-main"
        style={{
          marginLeft: isOpen ? 200 : 0,
          backgroundColor: "var(--color-bg)",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <Flex align="center" gap="lg" mb="lg">
          <button
            aria-label="Toggle sidebar"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            className={`hamburger ${isOpen ? "is-open" : ""}`}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="sr-only">Menu</span>
          </button>
          <ThemeToggle />
        </Flex>
        <Outlet />
        <Box as="footer" className="app-footer">
          <Text as="span" fontSize="sm" color="muted">
            InfraSight
          </Text>
          <Text as="span" fontSize="sm" color="muted" mx="sm">
            •
          </Text>
          <Text as="span" fontSize="sm" color="muted">
            Version: {import.meta.env.VITE_APP_VERSION || "0.1.0"}
          </Text>
          <Text as="span" fontSize="sm" color="muted" mx="sm">
            •
          </Text>
          <Text as="span" fontSize="sm" color="muted">
            Env: {import.meta.env.MODE}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
