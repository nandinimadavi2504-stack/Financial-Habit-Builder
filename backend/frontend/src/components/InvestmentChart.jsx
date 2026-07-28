import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function InvestmentChart({ investments }) {
  const data = investments.map((item) => ({
    name: item.investmentName || "Investment",
    invested: Number(item.amountInvested || 0),
    current: Number(item.currentValue || 0),
  }));

  if (!data.length) return null;

  return (
    <div className="chart-card">
      <h2 className="chart-title">Investment Performance</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="invested"
            name="Amount Invested"
            stroke="#2563eb"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="current"
            name="Current Value"
            stroke="#16a34a"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InvestmentChart;
