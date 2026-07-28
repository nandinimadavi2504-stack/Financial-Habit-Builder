import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function AssetChart({ assets }) {
  if (!assets.length) return null;

  const data = assets.map((asset) => ({
    name: asset.assetName,
    purchase: Number(asset.purchaseValue || 0),
    current: Number(asset.currentValue || 0),
  }));

  return (
    <div className="chart-card">
      <h2 className="chart-title">Asset Performance</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar dataKey="purchase" name="Purchase Value" fill="#2563eb" />

          <Bar dataKey="current" name="Current Value" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AssetChart;
