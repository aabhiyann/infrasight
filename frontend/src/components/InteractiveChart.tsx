import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Step 1: Create our data with multiple datasets
const chartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "AWS EC2",
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
    {
      label: "AWS S3",
      data: [800, 1200, 1500, 2000, 1800, 2200],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      label: "AWS RDS",
      data: [600, 900, 1200, 1500, 1100, 1400],
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 1,
    },
  ],
};

// Step 2: Create our chart options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Cloud Spending by Service",
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true, // This makes bars stack on top of each other
    },
    y: {
      stacked: true,
      beginAtZero: true,
    },
  },
};

// Step 3: Create our React component with state
export default function InteractiveChart() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // This function runs when you click on a bar
  const handleBarClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const month = chartData.labels[elementIndex];
      setSelectedMonth(month);
    }
  };

  return (
    <div style={{ width: "800px", height: "500px" }}>
      <h2>Interactive Chart - Click on a bar!</h2>
      <p>
        This chart shows spending by service and month. Click on any bar to see
        details.
      </p>

      {selectedMonth && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          <strong>You clicked on: {selectedMonth}</strong>
        </div>
      )}

      <Bar data={chartData} options={options} onClick={handleBarClick} />

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>What you're seeing:</strong>
        </p>
        <ul>
          <li>Each month has 3 bars (one for each service)</li>
          <li>Bars are stacked on top of each other</li>
          <li>Hover over bars to see exact values</li>
          <li>Click on bars to interact with them</li>
        </ul>
      </div>
    </div>
  );
}

