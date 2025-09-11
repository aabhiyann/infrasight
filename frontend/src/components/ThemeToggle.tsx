import { useState, useEffect } from "react";
import { Sun, Moon, Contrast } from "lucide-react";

type Theme = "light" | "dark" | "high-contrast";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "high-contrast"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon size={16} />;
      case "high-contrast":
        return <Contrast size={16} />;
      default:
        return <Sun size={16} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "dark":
        return "Dark mode";
      case "high-contrast":
        return "High contrast";
      default:
        return "Light mode";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="btn btn-ghost"
      title={`Switch to ${
        theme === "light"
          ? "dark"
          : theme === "dark"
          ? "high contrast"
          : "light"
      } mode`}
      aria-label={`Current theme: ${getLabel()}. Click to switch theme.`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0.75rem",
      }}
    >
      {getIcon()}
      <span className="text-small">{getLabel()}</span>
    </button>
  );
};

export default ThemeToggle;
