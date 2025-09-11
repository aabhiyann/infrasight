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
      <main
        style={{
          marginLeft: isOpen ? 200 : 0,
          padding: "2rem",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
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
            background: "#ffffff",
            border: "1px solid #dee2e6",
            padding: "0.5rem 0.75rem",
            borderRadius: 6,
            cursor: "pointer",
            position: "sticky",
            top: 16,
            zIndex: 10,
          }}
        >
          <span
            style={{
              width: 18,
              height: 2,
              background: "#212529",
              boxShadow: "0 6px 0 #212529, 0 -6px 0 #212529",
              display: "inline-block",
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
