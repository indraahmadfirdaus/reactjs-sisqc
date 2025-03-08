import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6666"];

export const LineChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      data={data.map((item) => ({
        name: `${item._id.month}/${item._id.year}`,
        total: item.totalReports || 0,
        approved: item.approvedCount || 0,
        rejected: item.rejectedCount || 0,
      }))}
      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
      <Line type="monotone" dataKey="approved" stroke="#00C49F" strokeWidth={2} />
      <Line type="monotone" dataKey="rejected" stroke="#FF8042" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export const PieChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data.map((item, index) => ({
          name: item._id,
          value: item.count,
          fill: COLORS[index % COLORS.length],
        }))}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export const BarChartComponent = ({ data, dataKey, xDataKey, color }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey={xDataKey}/>
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey} fill={color} />
    </BarChart>
  </ResponsiveContainer>
);
