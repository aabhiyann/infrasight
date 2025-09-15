import React from "react";
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

// Step 1: Register the components we need
// This tells Chart.js what types of charts we can make
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Step 2: Create our data
// This is like preparing ingredients for cooking
const sampleData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Monthly Spending ($)",
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

// Step 3: Create our chart options
// This is like setting the oven temperature and cooking time
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Cloud Spending",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Step 4: Create our React component
// This is like putting everything together in a recipe
export default function SimpleChart() {
  return (
    <div style={{ width: "600px", height: "400px" }}>
      <h2>My First Chart!</h2>
      <Bar data={sampleData} options={options} />
    </div>
  );
}
