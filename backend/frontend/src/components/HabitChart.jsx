import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function HabitChart({ habits }) {
  const data = habits.map((habit) => ({
    name: habit.title,
    streak: habit.streak,
  }));

  return (
    <div className="habit-chart">
      <h2>Habit Streak Overview</h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <Tooltip />

          <Bar dataKey="streak" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HabitChart;
