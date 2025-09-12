import { Box, Flex, Text } from "./ui";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({ title, onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 2);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
          <Text as="h1" fontSize="lg" fontWeight="semibold">
            {title || "Dashboard"}
          </Text>
        </Flex>
        <Flex align="center" gap="md">
          <ThemeToggle />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
