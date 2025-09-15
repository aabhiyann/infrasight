import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import { canvasBackgroundPlugin } from "../chartConfig";

/**
 * Simple chart registry to avoid duplicate Chart.js registration
 * Demonstrates DRY principle by centralizing registration logic
 */
class ChartRegistry {
  private static registered = false;

  /**
   * Register all Chart.js components once
   */
  static register() {
    if (this.registered) return;

    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend,
      Filler,
      TimeScale,
      canvasBackgroundPlugin
    );

    this.registered = true;
  }
}

// Auto-register on import
ChartRegistry.register();

export { ChartRegistry };
