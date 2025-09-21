import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data (replace with actual props or state)
const totalDebt = 10000;
const totalPaid = 6000;
const pendingDebt = totalDebt - totalPaid;

const data = [
  { name: "Paid", value: totalPaid },
  { name: "Pending", value: pendingDebt },
];

const COLORS = ["#00C49F", "#FF8042"]; // green for paid, orange for pending

const DebtPieChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DebtPieChart;
