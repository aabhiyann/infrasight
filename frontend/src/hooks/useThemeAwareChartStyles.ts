import { useState, useEffect } from "react";
import {
  getThemeAwareChartStyles,
  getThemeAwareColors,
} from "../components/chartConfig";

/**
 * Custom hook that provides theme-aware chart styles
 * Automatically updates when the theme changes
 */
export const useThemeAwareChartStyles = () => {
  const [chartStyles, setChartStyles] = useState(getThemeAwareChartStyles());
  const [colors, setColors] = useState(getThemeAwareColors());

  useEffect(() => {
    // Function to update styles when theme changes
    const updateStyles = () => {
      setChartStyles(getThemeAwareChartStyles());
      setColors(getThemeAwareColors());
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          updateStyles();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Initial update
    updateStyles();

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return { chartStyles, colors };
};

/**
 * Hook that provides just the theme-aware colors
 * Useful for components that only need colors
 */
export const useThemeAwareColors = () => {
  const [colors, setColors] = useState(getThemeAwareColors());

  useEffect(() => {
    const updateColors = () => {
      setColors(getThemeAwareColors());
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    updateColors();

    return () => {
      observer.disconnect();
    };
  }, []);

  return colors;
};
