import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Flex, Text } from "./ui";
import { LogoutIcon } from "./ui/Icons";

interface UserMenuProps {
  variant?: "header" | "sidebar";
}

const UserMenu = ({ variant = "sidebar" }: UserMenuProps) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) return null;

  const isHeader = variant === "header";

  return (
    <div
      className={isHeader ? "header-user" : "sidebar-user-dropdown"}
      ref={ref}
    >
      <button
        className={
          isHeader
            ? "header-user-trigger"
            : "sidebar-user-info sidebar-user-trigger"
        }
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {isHeader ? (
          <div className="header-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
        ) : (
          <Flex align="center" gap="sm" mb="none">
            <Box className="sidebar-avatar">
              <Text fontSize="sm" fontWeight="bold" style={{ color: "white" }}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </Box>
            <Box className="sidebar-user-text">
              <Text fontSize="sm" fontWeight="semibold" mb="none">
                {user.username}
              </Text>
              <Text fontSize="xs" color="muted" className="sidebar-user-email">
                {user.email}
              </Text>
            </Box>
          </Flex>
        )}
      </button>

      {open && (
        <div
          className={isHeader ? "header-user-menu" : "sidebar-user-menu"}
          role="menu"
        >
          {isHeader && (
            <div className="header-user-meta">
              <div className="name">{user.username}</div>
              <div className="email">{user.email}</div>
            </div>
          )}
          <button
            className={isHeader ? "header-menu-item" : "sidebar-menu-item"}
            role="menuitem"
          >
            Settings
          </button>
          <button
            className={
              (isHeader ? "header-menu-item" : "sidebar-menu-item") + " danger"
            }
            role="menuitem"
            onClick={logout}
          >
            {!isHeader && <LogoutIcon size={18} className="sidebar-icon" />}
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
