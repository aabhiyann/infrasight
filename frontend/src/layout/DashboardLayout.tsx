import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const onResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar isOpen={isOpen} />
      {/* Mobile overlay */}
      {!isOpen ? null : (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{ display: window.innerWidth < 768 ? "block" : "none" }}
        />
      )}
      <main
        style={{
          marginLeft: isOpen ? 200 : 0,
          padding: "2rem",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "var(--color-bg)",
          transition: "margin-left 0.3s ease",
        }}
      >
        <button
          aria-label="Toggle sidebar"
          onClick={() => setIsOpen((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: "1rem",
            background: isOpen ? "#f1f3f5" : "var(--color-surface)",
            border: "1px solid var(--color-border)",
            padding: "0.5rem 0.75rem",
            borderRadius: 999,
            cursor: "pointer",
            position: "sticky",
            top: 16,
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            transition: "background 200ms ease",
          }}
        >
          <span
            style={{
              width: 16,
              height: 2,
              background: "var(--color-text)",
              boxShadow:
                "0 6px 0 var(--color-text), 0 -6px 0 var(--color-text)",
              display: "inline-block",
              borderRadius: 2,
            }}
          />
          {isOpen ? "Hide" : "Show"} Menu
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
