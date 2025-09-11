import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { useEffect, useState } from "react";

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
    <div style={{ display: "flex" }}>
      <Sidebar isOpen={isOpen} />
      {/* Mobile overlay */}
      {isOpen && isMobile ? (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      ) : null}
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
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
          className={`hamburger ${isOpen ? "is-open" : ""}`}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="sr-only">Menu</span>
        </button>
        <Outlet />
        <footer className="app-footer">
          <span>InfraSight</span>
          <span style={{ marginLeft: 8, marginRight: 8 }}>•</span>
          <span>Version: {import.meta.env.VITE_APP_VERSION || "0.1.0"}</span>
          <span style={{ marginLeft: 8, marginRight: 8 }}>•</span>
          <span>Env: {import.meta.env.MODE}</span>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
